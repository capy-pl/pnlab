import axios from 'axios';

import { LoginResponse } from '../../declarations/auth';

export default class Auth {
  public static async login(email: string, password: string): Promise<string> {
    const response = await axios.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
    const { token } = response.data;
    return token;
  }

  public static logout(): void {
    localStorage.removeItem('Token');
  }

  public static async validate(): Promise<boolean> {
    const response = await axios.get('/auth/validate');
    if (response.status !== 200) {
      return false;
    }
    return true;
  }
}
