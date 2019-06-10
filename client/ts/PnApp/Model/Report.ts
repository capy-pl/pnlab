import axios from 'axios';
import {
  AddReportRequestBody,
  GetConditionsResponseBody,
  GetReportResponseBody,
  GetReportsResponseBody,
} from '../../../../server/api/report/controller';

export interface Condition {
  name: string;
  type: string;
  values?: string[];
}

export default class Report {
  public static async getConditions(): Promise<GetConditionsResponseBody> {
    const conditions = await axios.get<GetConditionsResponseBody>('/report/conditions');
    return conditions.data;
  }

  public static async get(id: string): Promise<GetReportResponseBody> {
    const report = await axios.get<GetReportResponseBody>(`/report/${id}`);
    return report.data;
  }

  public static async getAll(limit?: number): Promise<GetReportsResponseBody> {
    const url = limit && limit > 0 ? `/report?limit=${limit}` : '/report';
    const reports = await axios.get<GetReportsResponseBody>(url);
    return reports.data;
  }
}
