import axios from 'axios';

export interface OrganizationModel {
  _id: string;
  dbName: string;
  name: string;
}

export interface UserModel {
  _id: string;
  email: string;
  org: OrganizationModel;
}

class User {
  public static async get(): Promise<User> {
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
