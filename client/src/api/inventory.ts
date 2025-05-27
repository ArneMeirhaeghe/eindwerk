// File: src/api/inventory.ts
import API from './axios';

export interface Item {
  id: string;              // Unieke ID
  name: string;            // Naam van het item
  quantity: number;        // Huidig aantal
  lastQuantity: number;    // Vorig aantal
}

export interface Section {
  id: string;              // Unieke ID
  userId: string;          // Wordt overschreven in de API
  name: string;            // Naam van de sectie
  items: Item[];           // Items in deze sectie
}

// Sections CRUD
export const getSections = async (): Promise<Section[]> => {
  const res = await API.get<Section[]>('/inventory/sections');
  return res.data;
};

export const getSection = async (id: string): Promise<Section> => {
  const res = await API.get<Section>(`/inventory/sections/${id}`);
  return res.data;
};

// bij aanmaken sturen we ook id en userId mee (maar de server zal eigen values zetten)
export const createSection = async (name: string): Promise<Section> => {
  const payload: Partial<Section> = {
    id: '',
    userId: '',
    name,
    items: []
  };
  const res = await API.post<Section>('/inventory/sections', payload);
  return res.data;
};

// volledig Section-object meesturen (incl. items)
export const updateSection = async (section: Section): Promise<Section> => {
  const res = await API.put<Section>(
    `/inventory/sections/${section.id}`,
    section
  );
  return res.data;
};

export const deleteSection = async (id: string): Promise<void> => {
  await API.delete(`/inventory/sections/${id}`);
};

// Items CRUD binnen sectie
export const getItems = async (sectionId: string): Promise<Item[]> => {
  const res = await API.get<Item[]>(`/inventory/sections/${sectionId}/items`);
  return res.data;
};

export const createItem = async (
  sectionId: string,
  item: Omit<Item, 'id'>
): Promise<Item> => {
  // ook hier dummy-id meesturen om model-binding te laten slagen
  const payload = { id: '', ...item };
  const res = await API.post<Item>(
    `/inventory/sections/${sectionId}/items`,
    payload
  );
  return res.data;
};

export const updateItem = async (
  sectionId: string,
  itemId: string,
  item: Omit<Item, 'id'>
): Promise<Item> => {
  const res = await API.put<Item>(
    `/inventory/sections/${sectionId}/items/${itemId}`,
    item
  );
  return res.data;
};

export const deleteItem = async (
  sectionId: string,
  itemId: string
): Promise<void> => {
  await API.delete(`/inventory/sections/${sectionId}/items/${itemId}`);
};
