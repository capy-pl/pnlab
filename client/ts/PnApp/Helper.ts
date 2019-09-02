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

export type Query = {
  [key: string]: any;
};

export function appendQuery(path: string, query: Query) {
  const queryList: string[] = [];
  for (const key in query) {
    queryList.push(`${key}=${query[key]}`);
  }
  if (queryList.length) {
    return `${path}?${queryList.join('&')}`;
  }
  return path;
}

export function verboseFileSize(size: number): string {
  if (size > Math.pow(2, 30)) {
    const verboseSize = size / Math.pow(2, 30);
    return `${verboseSize.toFixed(2)} GB`;
  }

  if (size > Math.pow(2, 20)) {
    const verboseSize = size / Math.pow(2, 20);
    return `${verboseSize.toFixed(2)} MB`;
  }

  if (size > Math.pow(2, 10)) {
    const verboseSize = size / Math.pow(2, 10);
    return `${verboseSize.toFixed(2)} KB`;
  }

  return `${size} Bytes`;
}

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
  appendQuery,
  verboseFileSize,
};
