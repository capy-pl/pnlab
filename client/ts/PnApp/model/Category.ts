import axios from 'axios';

export interface CategoryModel {
  items: string[];
  name: string;
  _id?: string;
}

export default class Category {
  public static async getAll(): Promise<CategoryModel[]>  {
    const response = await axios.get<CategoryModel[]>('/api/category');
    return response.data;
  }

  public static async get(id: string): Promise<Category> {
    const response = await axios.get<CategoryModel>(`/api/category/${id}`);
    return new Category(response.data);
  }

  public static async add(body: CategoryModel): Promise<void> {
    await axios.post('/category', body);
  }

  public id: string;
  public name: string;
  public items: string[];

  constructor({_id, name, items}: CategoryModel) {
    this.id = _id as string;
    this.name = name;
    this.items = items;
  }

  public async update(props: CategoryModel): Promise<void> {
    if (props._id) {
      delete props._id;
    }
    axios.put(`/api/category/${this.id}`, props);
    for (const key in props) {
      if (key in this) {
        this[key] = props[key];
      }
    }
  }

  public async delete(): Promise<void> {
    await axios.delete(`/api/category/${this.id}`);
  }
}
