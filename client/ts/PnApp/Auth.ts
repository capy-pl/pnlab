import axios from 'axios';

interface LoginResponse {
  token: string;
}

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
    delete axios.defaults.headers.common['Authorization'];
  }

  public static async validate(): Promise<boolean> {
    const hasToken = localStorage.getItem('Token') !== null;
    if (!hasToken) {
      return false;
    }
    const token = localStorage.getItem('Token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      await axios.get('/auth/validate');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
