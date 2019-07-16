import axios from 'axios';

export interface CategoryModel {
  items: string[];
  name: string;
  _id?: string;
}

export default class Category {
  public static async getAll(): Promise<CategoryModel[]>  {
    const response = await axios.get<CategoryModel[]>('/category');
    return response.data;
  }

  public static async add(body: CategoryModel): Promise<void> {
    await axios.post('/category', body);
  }
}
