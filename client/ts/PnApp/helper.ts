import { createBrowserHistory } from 'history';
import LocalVar from './global';
import { User } from './Model';

export async function updateCurrentUser(): Promise<void> {
  try {
    LocalVar.user = await User.load();
  } catch (err) {
      createBrowserHistory().push('/#/account/login');
  }
}

export function getCurrentUser(): User {
  if (LocalVar.user) {
    return LocalVar.user;
  } else {
    
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
