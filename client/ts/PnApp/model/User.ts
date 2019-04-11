import axios from 'axios';

import { OrganizationModel, UserModel } from '../../../declarations/user';

class User {
  public static async load(): Promise<User> {
    const response = await axios.get<UserModel>('/user/info');
    return new User(response.data);
  }

  public id: string;
  public email: string;
  public org: OrganizationModel;

  constructor(obj: UserModel) {
    this.id = obj._id;
    this.email = obj.email;
    this.org = obj.org;
  }
}

export default User;
