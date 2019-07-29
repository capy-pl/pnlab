import axios from 'axios';
import Report from './Report';

export interface Comment {
  readonly user_id: string;
  _id?: string;
  name?: string;
  content: string;
  created?: Date;
  modified?: Date;
}

export interface AnalysisModel {
  readonly _id?: string;
  title?: string;
  description?: string;
  report: string | Report;
  comments?: Comment[];
  created?: Date;
}

export default class Analysis {
  public static async get(id: string): Promise<Analysis> {
    const response = await axios.get<AnalysisModel>(`/api/analysis/${id}`);
    return new Analysis(response.data);
  }

  public static async getAll(from?: number, limit?: number): Promise<Analysis[]> {
    const response = await axios.get<AnalysisModel[]>(`/api/analysis/`);
    return response.data.map((analysis) => new Analysis(analysis));
  }

  // The function will return the newly added analysis's id for redirect.
  public static async add(body: AnalysisModel): Promise<{id: string}> {
    const response = await axios.post<{id: string}>(`/api/analysis`, body);
    return response.data;
  }

  public readonly id: string;
  public title: string;
  public description: string;
  public comments: Comment[];
  public readonly created: Date;

  constructor(model: AnalysisModel) {
    this.id = model._id as string;
    this.title = model.title as string;
    this.description = model.description as string;
    this.comments = model.comments as Comment[];
    this.created = model.created as Date;
  }

  public async update(body: AnalysisModel): Promise<void> {
    await axios.put(`/api/analysis/${this.id}`, body);
    await this.reload();
  }

  public async delete(): Promise<void> {
    await axios.delete(`/api/analysis/${this.id}`);
  }

  public async addComment(content: string): Promise<void> {
    await axios.post(`/api/analysis/${this.id}/comment`, { content });
    await this.reload();
  }

  public async updateComment(body: Comment): Promise<void> {
    await axios.post(`/api/analysis/${this.id}/comment/${body._id}`, body);
    await this.reload();
  }

  public async deleteComment(commentId: string): Promise<void> {
    await axios.delete(`/api/analysis/${this.id}/comment/${commentId}`);
    await this.reload();
  }

  public async reload(): Promise<void> {
    const response = await axios.get<AnalysisModel>(`/api/analysis/${this.id}`);
    this.set(response.data);
  }

  public set(data: { [key: string]: any }): Analysis {
    for (const key in data) {
      if (key in this) {
        this[key] = data[key];
      }
    }
    return this;
  }
}
