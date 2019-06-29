import axios from 'axios';
export interface Condition {
  name: string;
  type: string | 'string' | 'int' | 'date' | 'float';
  values: string[] | Date[];
}

export interface Node {
  name: string;
  community: number;
  id: number;
  degree: number;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface ProjectedReport {
  _id: string;
  created: Date;
  conditions: Condition[];
  modified: Date;
  status: 'error' | 'pending' | 'success';
  errMessage: string;
  startTime: Date;
  endTime: Date;
}

interface ReportModel {
  _id: string;
  created: Date;
  conditions: Condition[];
  modified: Date;
  status: 'error' | 'pending' | 'success';
  errMessage: string;
  nodes: Node[];
  edges: Edge[];
  startTime: Date;
  endTime: Date;
}

export default class Report {
  // public static async add(body: Condition[]): Promise<AddReportResponseBody> {

  // }

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

  constructor({
    _id,
    created,
    conditions,
    modified,
    status,
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
  }
}
