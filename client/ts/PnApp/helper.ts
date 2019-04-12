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

export default {
  getCurrentUser,
  hasToken,
  isLoggedIn,
  updateCurrentUser,
};
