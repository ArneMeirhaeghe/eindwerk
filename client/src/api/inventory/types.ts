// File: src/api/inventory/types.ts

export interface Item {
  id: string;
  name: string;
  quantity: number;
  lastQuantity: number;
}

export interface Section {
  id: string;
  userId: string;
  name: string;
  items: Item[];
}
