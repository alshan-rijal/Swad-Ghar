// Mock persistence layer. The whole demo database lives in one localStorage key,
// so the waiter, chef and owner tabs share the same data.
import type { Bill, MenuItem, Order, OrderItem, OrderStatus, PaymentMethod, Table, User } from '../types';
import { monthToDateKeys, nepalDateKey } from '../lib/time';

export interface DbUser extends User {
  password: string;
}

export interface Db {
  users: DbUser[];
  menu: MenuItem[];
  tables: Table[];
  orders: Order[];
  bills: Bill[];
}

export const DB_KEY = 'sg.db';
export const SESSION_KEY = 'sg.session';

const PAYMENTS: PaymentMethod[] = ['cash', 'esewa', 'khalti', 'bank_qr'];
const pad = (n: number) => String(n).padStart(2, '0');

// Deterministic PRNG so the demo numbers are the same on every machine.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sum = (items: OrderItem[]) => items.reduce((total, i) => total + i.price * i.qty, 0);

function seedDb(): Db {
  const rand = rng(20260101);
  const users: DbUser[] = [
    { id: 'u1', name: 'Suresh Shrestha', username: 'suresh', password: 'suresh123', role: 'admin', active: true },
    { id: 'u2', name: 'Bikash Limbu', username: 'bikash', password: 'bikash123', role: 'chef', active: true },
    { id: 'u3', name: 'Ramesh Rai', username: 'ramesh', password: 'ramesh123', role: 'waiter', active: true },
  ];

  const menu: MenuItem[] = [
    { id: 'm1', name: 'Steam Momo', category: 'Momo', price: 220, available: true },
    { id: 'm2', name: 'Fry Momo', category: 'Momo', price: 250, available: true },
    { id: 'm3', name: 'Chilli Momo', category: 'Momo', price: 280, available: true },
    { id: 'm4', name: 'Kothey Momo', category: 'Momo', price: 260, available: true },
    { id: 'm5', name: 'Veg Chowmein', category: 'Noodles', price: 180, available: true },
    { id: 'm6', name: 'Chicken Chowmein', category: 'Noodles', price: 220, available: true },
    { id: 'm7', name: 'Thukpa', category: 'Noodles', price: 200, available: true },
    { id: 'm8', name: 'Milk Tea', category: 'Drinks', price: 50, available: true },
    { id: 'm9', name: 'Coffee', category: 'Drinks', price: 80, available: true },
    { id: 'm10', name: 'Coke', category: 'Drinks', price: 100, available: true },
  ];

  const tables: Table[] = Array.from({ length: 8 }, (_, i) => ({
    id: `t${i + 1}`,
    number: i + 1,
    status: 'free' as const,
  }));

  const orders: Order[] = [];
  const bills: Bill[] = [];
  let seq = 0;
  const nextId = (prefix: string) => `${prefix}${++seq}`;

  const buildItems = (): OrderItem[] => {
    const chosen = new Map<string, OrderItem>();
    const kinds = 1 + Math.floor(rand() * 3);
    for (let i = 0; i < kinds; i++) {
      const item = menu[Math.floor(rand() * menu.length)];
      const qty = 1 + Math.floor(rand() * 3);
      const existing = chosen.get(item.name);
      if (existing) existing.qty += qty;
      else chosen.set(item.name, { name: item.name, price: item.price, qty });
    }
    return [...chosen.values()];
  };

  const addPaidBill = (paidAt: Date) => {
    const items = buildItems();
    const tableNumber = 1 + Math.floor(rand() * tables.length);
    const order: Order = {
      id: nextId('o'),
      tableId: `t${tableNumber}`,
      tableNumber,
      items,
      status: 'served',
      createdBy: 'u3',
      createdAt: new Date(paidAt.getTime() - 30 * 60 * 1000).toISOString(),
    };
    orders.push(order);
    bills.push({
      id: nextId('b'),
      tableId: order.tableId,
      tableNumber,
      orderIds: [order.id],
      items,
      total: sum(items),
      paymentMethod: PAYMENTS[Math.floor(rand() * PAYMENTS.length)],
      paidAt: paidAt.toISOString(),
      paidBy: 'u1',
    });
  };

  // Past days of this month, then two bills earlier today.
  const todayKey = nepalDateKey(new Date());
  for (const key of monthToDateKeys()) {
    if (key === todayKey) continue;
    const count = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const hour = 11 + Math.floor(rand() * 9);
      addPaidBill(new Date(`${key}T${pad(hour)}:${pad(Math.floor(rand() * 60))}:00+05:45`));
    }
  }
  const now = Date.now();
  addPaidBill(new Date(now - 2 * 60 * 60 * 1000));
  addPaidBill(new Date(now - 60 * 60 * 1000));

  // Two tables still open so the waiter and the dashboard have something live.
  const addOpenBill = (tableNumber: number, status: OrderStatus) => {
    const items = buildItems();
    const table = tables[tableNumber - 1];
    table.status = 'occupied';
    const order: Order = {
      id: nextId('o'),
      tableId: table.id,
      tableNumber,
      items,
      status,
      createdBy: 'u3',
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
    };
    orders.push(order);
    bills.push({
      id: nextId('b'),
      tableId: table.id,
      tableNumber,
      orderIds: [order.id],
      items,
      total: sum(items),
    });
  };
  addOpenBill(3, 'placed');
  addOpenBill(6, 'served');

  return { users, menu, tables, orders, bills };
}

export function loadDb(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    // Corrupt or unavailable storage: fall through and reseed.
  }
  const db = seedDb();
  saveDb(db);
  return db;
}

export function saveDb(db: Db): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
