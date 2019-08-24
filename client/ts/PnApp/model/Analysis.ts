import axios from 'axios';
import Report from './Report';
import { appendQuery } from '../Helper';

export interface Comment {
  readonly userId: string;
  _id: string;
  name: string;
  content: string;
  created: Date;
  modified: Date;
}

export interface AnalysisModel {
  readonly _id: string;
  title: string;
  description: string;
  report: string;
  comments: Comment[];
  created: string | Date;
  modified: string | Date;
}

export type AnalysisPreview = Pick<
  AnalysisModel,
  '_id' | 'title' | 'description' | 'created' | 'modified'
>;

export type CommentUpdateBody = Pick<Comment, '_id' | 'content'>;

export type AnalysisUpdateBody = Pick<Analysis, 'title' | 'description'>;

interface ListQuery {
  page: number;
  limit: number;
}

export default class Analysis {
  public static async get(id: string): Promise<Analysis> {
    const response = await axios.get<AnalysisModel>(`/api/analysis/${id}`);
    return new Analysis(response.data);
  }

  public static async getAll(query?: ListQuery): Promise<AnalysisPreview[]> {
    const url = query ? appendQuery(`/api/analysis`, query) : '/api/report';
    const response = await axios.get<AnalysisPreview[]>(url);
    return response.data.map((analysis) => ({
      ...analysis,
      created: new Date(analysis.created),
      modified: new Date(analysis.modified),
    }));
  }

  // The function will return the newly added analysis's id for redirect.
  public static async add(body: AnalysisModel): Promise<{ id: string }> {
    const response = await axios.post<{ id: string }>(`/api/analysis`, body);
    return response.data;
  }

  public readonly id: string;
  public title: string;
  public description: string;
  public comments: Comment[];
  public readonly created: Date;
  public report: string | Report;

  constructor(model: AnalysisModel) {
    this.id = model._id as string;
    this.title = model.title as string;
    this.description = model.description as string;
    this.comments = (model.comments as Comment[]).map((comment) => ({
      ...comment,
      created: new Date(comment.created),
      modified: new Date(comment.modified),
    })) as Comment[];
    this.created = new Date(model.created as string) as Date;
    this.report = model.report;
  }

  public async loadReport(): Promise<void> {
    this.report = await Report.get(this.report as string);
  }

  public async update(body: AnalysisUpdateBody): Promise<void> {
    await axios.put(`/api/analysis/${this.id}`, body);
    await this.reload();
  }

  public async delete(): Promise<void> {
    await axios.delete(`/api/analysis/${this.id}`);
  }

  public async addComment(content: string): Promise<void> {
    await axios.post(`/api/analysis/${this.id}/comment`, {
      content,
    });
    await this.reload();
  }

  public async updateComment(body: CommentUpdateBody): Promise<void> {
    await axios.put(`/api/analysis/${this.id}/comment/${body._id}`, body);
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
        if (key === 'comments') {
          this.comments = (data.comments as Comment[]).map((comment) => ({
            ...comment,
            created: new Date(comment.created),
            modified: new Date(comment.modified),
          })) as Comment[];
        }
        this[key] = data[key];
      }
    }
    return this;
  }
}
