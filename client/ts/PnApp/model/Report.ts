import axios from 'axios';
import Jgraph from '../Jgraph';
import { appendQuery } from '../Helper';

type MethodType = 'frequency' | 'adjust-frequency' | 'adjust-price';

export type ConditionType = 'string' | 'int' | 'date' | 'float' | 'promotion' | 'method';
export type ConditionAction = 'reserve' | 'delete' | 'promotion';
export type ConditionBelong = 'transaction' | 'item' | 'promotion' | 'method';

export interface Condition {
  name: string;
  type: ConditionType;
  values: string[] | string | MethodType;
  actions: ConditionAction[];
  belong: ConditionBelong;
}

export interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
  weight: number;
  core: boolean | string;
}

export type SimpleNode = Pick<Node, 'id' | 'name' | 'weight'>;

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface CommunityDetail {
  id: number;
  core?: string;
  items: SimpleNode[];
  weight: number;
  averagePrice: number;
  tags: string[];
}

export type Community = Pick<CommunityDetail, 'id' | 'core' | 'items' | 'weight'>;

export interface Hook {
  name: string;
  weight: number;
  connectTo: number[]; // The community ids to which the hook connect
}

export type ReportStatus = 'error' | 'pending' | 'success';

export interface ReportModel {
  _id: string;
  created: Date;
  communities: Community[];
  conditions: Condition[];
  modified: Date;
  status: ReportStatus;
  errMessage: string;
  nodes: Node[];
  edges: Edge[];
  hooks: Hook[];
  rank: SimpleNode[];
}

export type ReportPreview = Pick<
  ReportModel,
  '_id' | 'created' | 'conditions' | 'modified' | 'status' | 'errMessage'
>;

interface ListQuery {
  page: number;
  limit: number;
}

export default class Report {
  public static async add(conditions: Condition[]): Promise<{ id: string }> {
    const { data } = await axios.post<{ id: string }>(`/api/report/`, { conditions });
    return data;
  }

  public static async getConditions(): Promise<Condition[]> {
    const conditions = await axios.get<{
      conditions: Condition[];
    }>('/api/report/conditions');
    return conditions.data.conditions;
  }

  public static async get(id: string): Promise<Report> {
    const report = await axios.get<ReportModel>(`/api/report/${id}`);
    return new Report(report.data);
  }

  public static async getAll(query?: ListQuery): Promise<ReportPreview[]> {
    const url = query ? appendQuery(`/api/report`, query) : '/api/report';
    const reports = await axios.get<{
      reports: ReportPreview[];
    }>(url);
    reports.data.reports.forEach((report) => {
      // attributes below are type of string when returned from axios. need to
      // convert their type from string to Date.
      report.created = new Date(report.created);
      report.modified = new Date(report.modified);
    });
    return reports.data.reports;
  }

  public id: string;
  public created: Date;
  public conditions: Condition[];
  public modified: Date;
  public status: ReportStatus;
  public errMessage: string;
  public nodes: Node[];
  public edges: Edge[];
  public communities: Community[];
  public hooks: Hook[];
  public rank: SimpleNode[];
  public graph: Jgraph;

  constructor({
    _id,
    created,
    conditions,
    modified,
    status,
    rank,
    errMessage,
    nodes,
    edges,
    communities,
    hooks,
  }: ReportModel) {
    this.id = _id;
    this.created = new Date(created);
    this.conditions = conditions;
    this.modified = new Date(modified);
    this.status = status;
    this.errMessage = errMessage;
    this.nodes = nodes;
    this.edges = edges;
    this.communities = communities;
    this.hooks = hooks;
    this.rank = rank;
    this.graph = new Jgraph(nodes, edges);
  }

  get method(): MethodType {
    for (const condition of this.conditions) {
      if (condition.type === 'method') {
        return condition.values as MethodType;
      }
    }
    return 'frequency';
  }

  public async getCommunityDetail(id: number): Promise<CommunityDetail> {
    const response = await axios.get<CommunityDetail>(
      `/api/report/${this.id}/community/${id}`,
    );
    return response.data;
  }
}
