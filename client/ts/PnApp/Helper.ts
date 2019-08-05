import axios from 'axios';

import Store from './global';
import { User } from './model';

export async function updateCurrentUser(): Promise<void> {
  Store.user = await User.get();
}

export function getCurrentUser(): User | undefined {
  return Store.user;
}

export function hasToken(): boolean {
  return localStorage.getItem('Token') !== null;
}

export function isLoggedIn(): boolean {
  return !(Store.user === undefined);
}

export async function searchItem(name: string): Promise<{ items: string[]}> {
  const response = await axios.get<{ items: string[] }>(`/api/report/searchItem?query=${name}`);
  return response.data;
}

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
};
