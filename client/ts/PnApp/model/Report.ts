import axios from 'axios';

export type ConditionType = 'string' | 'int' | 'date' | 'float' | 'promotion';
export interface Condition {
  name: string;
  type: ConditionType;
  values: string[];
}

export interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
  weight: number;
  core: boolean;
}

interface SimpleNode {
  name: string;
  weight: number;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface Community {
  core?: string;
  items: SimpleNode[];
  weight: number;
}

export interface Hook {
  name: string;
  weight: number;
  connectTo: number[];  // The community ids to which the hook connect
}

export type ReportStatus = 'error' | 'pending' | 'success';

export interface ProjectedReport {
  _id: string;
  created: Date;
  conditions: Condition[];
  modified: Date;
  status: ReportStatus;
  errMessage: string;
  startTime: Date;
  endTime: Date;
}

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
  startTime: Date;
  endTime: Date;
}

export default class Report {
  public static async add(conditions: Condition[]): Promise<{ id: string }> {
    const { data } = await axios.post<{ id: string }>(`/report/`, { conditions });
    return data;
  }

  public static async getConditions(): Promise<Condition[]> {
    const conditions = await axios.get<{ conditions: Condition[]}>('/report/conditions');
    return conditions.data.conditions;
  }

  public static async get(id: string): Promise<Report> {
    const report = await axios.get<ReportModel>(`/report/${id}`);
    return new Report(report.data);
  }

  public static async getAll(limit?: number): Promise<ProjectedReport[]> {
    const url = limit && limit > 0 ? `/report?limit=${limit}` : '/report';
    const reports = await axios.get<{ reports: ProjectedReport[]}>(url);
    reports.data.reports.forEach((report) => {
      // attributes below are type of string when returned from axios. need to
      // convert their type from string to Date.
      report.created = new Date(report.created);
      report.modified = new Date(report.modified);
      report.startTime = new Date(report.startTime);
      report.endTime = new Date(report.endTime);
    });
    return reports.data.reports;
  }

  public id: string;
  public created: Date;
  public conditions: Condition[];
  public modified: Date;
  public status: 'error' | 'pending' | 'success';
  public errMessage: string;
  public nodes: Node[];
  public edges: Edge[];
  public startTime: Date;
  public endTime: Date;
  public rank: SimpleNode[];

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
    startTime,
    endTime }: ReportModel) {
    this.id = _id;
    this.created = new Date(created);
    this.conditions = conditions;
    this.modified = new Date(modified);
    this.status = status;
    this.errMessage = errMessage;
    this.nodes = nodes;
    this.edges = edges;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.rank = rank;
  }
}
