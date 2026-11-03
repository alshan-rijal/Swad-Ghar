export type Role = 'waiter' | 'chef' | 'admin';
export type TableStatus = 'free' | 'occupied';
export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'served';
export type PaymentMethod = 'cash' | 'esewa' | 'khalti' | 'bank_qr';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number; // whole rupees
  available: boolean;
}

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
}

export interface OrderItem {
  name: string;
  price: number; // whole rupees, price at the time of ordering
  qty: number;
  note?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdBy: string; // user id
  createdAt: string; // ISO instant
}

export interface Bill {
  id: string;
  tableId: string;
  tableNumber: number;
  orderIds: string[];
  items: OrderItem[]; // all items on the table, merged by name
  total: number; // whole rupees
  paymentMethod?: PaymentMethod;
  paidAt?: string; // ISO instant
  paidBy?: string; // user id
}

export interface DailySales {
  date: string; // 'YYYY-MM-DD' in Nepal time
  total: number;
}

export interface Summary {
  todayOrders: number;
  todaySales: number;
  monthOrders: number;
  monthSales: number;
  dailySales: DailySales[]; // this month, 1st to today, one entry per day
  openBills: Bill[];
  recentBills: Bill[]; // paid, newest first
}

export const HOME_PATH: Record<Role, string> = {
  waiter: '/waiter',
  chef: '/chef',
  admin: '/admin',
};
