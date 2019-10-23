import axios from 'axios';
import Organization from './Organization';

export interface UserAjaxResponse {
  _id: string;
  email: string;
  org: Organization;
}

class User {
  public static async get(): Promise<User> {
    const response = await axios.get<UserAjaxResponse>('/api/user/info');
    return new User(response.data);
  }

  public id: string;
  public email: string;
  public org: Organization;

  constructor(obj: UserAjaxResponse) {
    this.id = obj._id;
    this.email = obj.email;
    this.org = obj.org;
  }
}

export default User;
