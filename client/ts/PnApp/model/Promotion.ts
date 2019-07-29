import axios from 'axios';

export type PromotionType = 'combination' | 'direct';

export interface PromotionModel {
  name: string;
  type: PromotionType;
  groupOne: string[];
  groupTwo: string[];
  _id?: string;
  startTime: string;
  endTime: string;
}

export default class Promotion {
  public static async getAll(): Promise<Promotion[]> {
    const response = await axios.get<PromotionModel[]>('/promotion');
    return response.data.map((promotion) => new Promotion(promotion));
  }

  public static async add(body: PromotionModel): Promise<void> {
    await axios.post('/api/promotion', body);
  }

  public static async get(id: string): Promise<Promotion> {
    const response = await axios.get<PromotionModel>(`/promotion/${id}`);
    return new Promotion(response.data);
  }

  public name: string;
  public type: PromotionType;
  public id: string;
  public groupOne: string[];
  public groupTwo: string[];
  public startTime: Date;
  public endTime: Date;

  constructor(props: PromotionModel) {
    const { name, type, _id, groupOne, groupTwo, startTime, endTime } = props;
    this.id = _id as string;
    this.name = name;
    this.type = type;
    this.groupOne = groupOne;
    this.groupTwo = groupTwo;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
  }

  public async update(props: PromotionModel): Promise<void> {
    await axios.put(`/api/promotion/${this.id}`, props);
    for (const key in props) {
      if (key in this) {
        this[key] = props[key];
      }
    }
  }

  public async delete(): Promise<void> {
    await axios.delete(`/api/promotion/${this.id}`);
  }
}
