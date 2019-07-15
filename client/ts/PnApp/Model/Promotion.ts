import axios from 'axios';

type PromotionType = 'combination' | 'direct';

export interface PromotionModel {
  name: string;
  type: PromotionType;
  groupOne: string[];
  groupTwo: string[];
  _id?: string;
}

export default class Promotion {
  public static async getAll(): Promise<PromotionModel[]>  {
    const response = await axios.get<PromotionModel[]>('/promotion');
    return response.data;
  }

  public static async add(body: PromotionModel): Promise<void> {
    await axios.post('/promotion', body);
  }
}
