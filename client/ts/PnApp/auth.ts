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
    // tslint:disable-next-line:no-string-literal
    delete axios.defaults.headers.common['Authorization'];
  }

  public static async validate(): Promise<boolean> {
    const hasToken = localStorage.getItem('Token') !== null;
    if (!hasToken) {
      return false;
    }
    const token = localStorage.getItem('Token');
    // tslint:disable-next-line:no-string-literal
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get('/auth/validate');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
