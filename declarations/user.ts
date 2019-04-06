export interface OrganizationModel {
  _id: string;
  dbName: string;
  name: string;
}

export interface UserModel {
  _id: string;
  email: string;
  password: string;
  org: OrganizationModel;
}
