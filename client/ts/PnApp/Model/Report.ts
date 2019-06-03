import axios from 'axios';

interface GetConditionResponse {
  conditions: Condition[];
}

export interface Condition {
  name: string;
  type: string;
  values?: string[];
}

export default class Report {
  public static async getConditions(): Promise<GetConditionResponse> {
    const conditions = await axios.get<GetConditionResponse>('/report/conditions');
    return conditions.data;
  } 
}
