import LocalVar from './global';
import { User } from './model';

export async function updateCurrentUser(): Promise<void> {
  LocalVar.user = await User.load();
}

export function getCurrentUser(): User {
  if (LocalVar.user) {
    return LocalVar.user;
  } else {
    throw new Error('User is not loaded. Please call updateCurrentUser first.');
  }
}

export function hasToken(): boolean {
  return localStorage.getItem('Token') !== null;
}

export function isLoggedIn(): boolean {
  return !(LocalVar.user === undefined);
}

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
};
