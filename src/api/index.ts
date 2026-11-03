// The one data-access module the whole frontend talks to.
// The real Cloudflare Workers API (Phase 4) must match these names, signatures and shapes.
import type {
  Bill,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Role,
  Summary,
  User,
} from '../types';
import { nepalDateKey, monthToDateKeys, startOfNepalDay, startOfNepalMonth } from '../lib/time';
import { loadDb, saveDb, SESSION_KEY, type Db } from './store';

// The mock is synchronous; a small delay keeps the loading states honest.
// shortcut: fake latency, remove when the real API is wired in.
const later = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 100));

const sum = (items: OrderItem[]) => items.reduce((total, i) => total + i.price * i.qty, 0);

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function mergeItems(items: OrderItem[]): OrderItem[] {
  const merged = new Map<string, OrderItem>();
  for (const item of items) {
    const existing = merged.get(item.name);
    if (existing) existing.qty += item.qty;
    else merged.set(item.name, { ...item });
  }
  return [...merged.values()];
}

function openBill(db: Db, tableId: string): Bill | undefined {
  return db.bills.find((b) => b.tableId === tableId && !b.paidAt);
}

function currentUser(): User {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) throw new Error('Not signed in');
  return JSON.parse(raw) as User;
}

function requireRole(...roles: Role[]): User {
  const user = currentUser();
  if (!roles.includes(user.role)) throw new Error('You are not allowed to do that');
  return user;
}

export async function login(username: string, password: string): Promise<User> {
  const db = loadDb();
  const found = db.users.find(
    (u) => u.username === username.trim().toLowerCase() && u.password === password && u.active,
  );
  if (!found) throw new Error('Wrong username or password');
  const user: User = {
    id: found.id,
    name: found.name,
    username: found.username,
    role: found.role,
    active: found.active,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return later(user);
}

export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
  return later(undefined);
}

/** Session survives a refresh; returns null when signed out. */
export function getSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function getMenu() {
  const db = loadDb();
  return later([...db.menu]);
}

export async function getTables() {
  const db = loadDb();
  return later([...db.tables]);
}

export async function getOrders(): Promise<Order[]> {
  const db = loadDb();
  return later([...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function createOrder(tableId: string, items: OrderItem[]): Promise<Order> {
  const user = requireRole('waiter', 'admin');
  if (items.length === 0) throw new Error('Add at least one item');
  const db = loadDb();
  const table = db.tables.find((t) => t.id === tableId);
  if (!table) throw new Error('Table not found');

  const order: Order = {
    id: newId('o'),
    tableId,
    tableNumber: table.number,
    items,
    status: 'placed',
    createdBy: user.id,
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  table.status = 'occupied';

  let bill = openBill(db, tableId);
  if (!bill) {
    bill = {
      id: newId('b'),
      tableId,
      tableNumber: table.number,
      orderIds: [],
      items: [],
      total: 0,
    };
    db.bills.push(bill);
  }
  bill.orderIds.push(order.id);
  bill.items = mergeItems([...bill.items, ...items]);
  bill.total = sum(bill.items);

  saveDb(db);
  return later(order);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  if (status === 'preparing' || status === 'ready') requireRole('chef', 'admin');
  else requireRole('waiter', 'admin');

  const db = loadDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error('Order not found');
  order.status = status;
  saveDb(db);
  return later(order);
}

/** The open (unpaid) bill for a table, with all its items. Empty bill when nothing is open. */
export async function getBill(tableId: string): Promise<Bill> {
  const db = loadDb();
  const table = db.tables.find((t) => t.id === tableId);
  if (!table) throw new Error('Table not found');
  const bill = openBill(db, tableId);
  return later(
    bill ?? { id: '', tableId, tableNumber: table.number, orderIds: [], items: [], total: 0 },
  );
}

/** Only the owner marks a bill paid. This also frees the table. */
export async function payBill(tableId: string, paymentMethod: PaymentMethod): Promise<Bill> {
  const user = requireRole('admin');
  const db = loadDb();
  const table = db.tables.find((t) => t.id === tableId);
  const bill = table && openBill(db, tableId);
  if (!table || !bill || bill.total <= 0) throw new Error('Nothing to pay for this table');

  bill.paymentMethod = paymentMethod;
  bill.paidAt = new Date().toISOString();
  bill.paidBy = user.id;
  table.status = 'free';
  saveDb(db);
  return later(bill);
}

export async function getSummary(): Promise<Summary> {
  requireRole('admin');
  const db = loadDb();
  const dayStart = startOfNepalDay().getTime();
  const monthStart = startOfNepalMonth().getTime();
  const paid = db.bills.filter((b) => b.paidAt);
  const inRange = (iso: string, from: number) => new Date(iso).getTime() >= from;

  const byDay = new Map<string, number>(monthToDateKeys().map((key) => [key, 0]));
  for (const bill of paid) {
    if (!inRange(bill.paidAt!, monthStart)) continue;
    const key = nepalDateKey(bill.paidAt!);
    byDay.set(key, (byDay.get(key) ?? 0) + bill.total);
  }

  const summary: Summary = {
    todayOrders: db.orders.filter((o) => inRange(o.createdAt, dayStart)).length,
    todaySales: paid.filter((b) => inRange(b.paidAt!, dayStart)).reduce((t, b) => t + b.total, 0),
    monthOrders: db.orders.filter((o) => inRange(o.createdAt, monthStart)).length,
    monthSales: paid.filter((b) => inRange(b.paidAt!, monthStart)).reduce((t, b) => t + b.total, 0),
    dailySales: [...byDay].map(([date, total]) => ({ date, total })),
    openBills: db.bills.filter((b) => !b.paidAt),
    recentBills: [...paid].sort((a, b) => b.paidAt!.localeCompare(a.paidAt!)).slice(0, 8),
  };
  return later(summary);
}
