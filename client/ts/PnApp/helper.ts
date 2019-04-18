import LocalVar from './global';
import { User } from './Model';

export async function updateCurrentUser(): Promise<void> {
    LocalVar.user = await User.load();
}

export function getCurrentUser(): User | undefined {
    return LocalVar.user;
}

export function hasToken(): boolean {
  return localStorage.getItem('Token') !== null;
}

export function isLoggedIn(): boolean {
  return !(LocalVar.user === undefined);
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
  getRandomColor,
};
