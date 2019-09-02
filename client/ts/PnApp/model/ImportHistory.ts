import axios, { AxiosRequestConfig } from 'axios';
import { appendQuery } from '../Helper';

type ImportHistoryStatus = 'success' | 'error' | 'pending';

interface ImportHistoryModel {
  _id: string;
  filepath: string;
  filename: string;
  fileSize: number;
  originFilename: string;
  transactionNum: number;
  itemNum: number;
  created: Date;
  modified: Date;
  status: ImportHistoryStatus;
  errMessage?: string;
  md5: string;
}

interface ListQuery {
  page: number;
  limit: number;
}

export default class ImportHistory {
  public static async getAll(
    query?: ListQuery,
    config?: AxiosRequestConfig,
  ): Promise<ImportHistory[]> {
    const response = await axios.get<ImportHistoryModel[]>(
      appendQuery(`/api/upload`, query || {}),
      config,
    );
    return response.data.map((model) => new ImportHistory(model));
  }

  public static async get(
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<ImportHistory> {
    const response = await axios.get<ImportHistoryModel>(`/api/upload/${id}`, config);
    return new ImportHistory(response.data);
  }

  public static async add(
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    const response = await axios.post(`/api/upload`, formData, config);
    return response.data;
  }

  public id: string;
  public filepath: string;
  public filename: string;
  public fileSize: number;
  public originFilename: string;
  public transactionNum: number;
  public itemNum: number;
  public created: Date;
  public modified: Date;
  public status: ImportHistoryStatus;
  public errMessage?: string;
  public md5: string;

  constructor({
    _id,
    filepath,
    filename,
    fileSize,
    originFilename,
    transactionNum,
    itemNum,
    created,
    modified,
    status,
    errMessage,
    md5,
  }: ImportHistoryModel) {
    this.id = _id;
    this.filepath = filepath;
    this.filename = filename;
    this.fileSize = fileSize;
    this.originFilename = originFilename;
    this.transactionNum = transactionNum;
    this.itemNum = itemNum;
    this.created = created;
    this.modified = modified;
    this.status = status;
    this.errMessage = errMessage;
    this.md5 = md5;
  }
}
