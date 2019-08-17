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

export async function searchItem(name: string): Promise<{ items: string[] }> {
  const response = await axios.get<{ items: string[] }>(
    `/api/report/searchItem?query=${name}`,
  );
  return response.data;
}

export function stringToDate(str: string): Date {
  const date = new Date(str);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
}

export function dateToString(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function simplifyDate(str: string): string {
  return dateToString(stringToDate(str));
}

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
};
