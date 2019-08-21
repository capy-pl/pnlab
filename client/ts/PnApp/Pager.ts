import axios from 'axios';
import { appendQuery, Query } from './Helper';

export interface PagerQuery extends Query {
  startPage: number; // page start number.
  pageLimit: number; // how many pages can be displayed.
  limit: number; // how many records a page can show.
}

interface PagerResponse {
  // If true, remain page number is enough to display next `pageLimit` pages.
  hasNext: boolean;
  // When hasNext is false, it return how many remained pages can be displayed.
  leftNumber?: number;
}

export interface PagerState extends PagerQuery {
  hasNext?: boolean;
  leftNumber?: number;
  currentPage: number;
}

export default class Pager {
  private path: string;
  private limit: number;
  private pageLimit: number;
  private _startPage?: number;
  private _hasNext?: boolean;
  private _leftNumber?: number;

  /**
   *
   * @param {string} path The path of paging api.
   * @param {number} pageLimit Maximum page number can be displayed at a time.
   * @param {number} limit Maximum record number a page can display at a time.
   */
  constructor(path: string, pageLimit = 10, limit = 25) {
    this.path = path;
    this.pageLimit = pageLimit;
    this.limit = limit;
    this._startPage = 1;
  }

  public async setStartPage(startPage: number): Promise<void> {
    const query: PagerQuery = {
      startPage,
      pageLimit: this.pageLimit,
      limit: this.limit,
    };
    const { data } = await axios.get<PagerResponse>(appendQuery(this.path, query));
    this._startPage = startPage;
    this._hasNext = data.hasNext;
    if (!this.hasNext && data.leftNumber) {
      this._leftNumber = data.leftNumber as number;
    } else {
      this._leftNumber = undefined;
    }
  }

  /**
   * Please aware if you set a new page limit, it will reset start page to 1.
   * @param {number} pageLimit
   */
  public async setPageLimit(pageLimit: number): Promise<void> {
    const query: PagerQuery = {
      startPage: 1,
      pageLimit,
      limit: this.limit,
    };
    const { data } = await axios.get<PagerResponse>(appendQuery(this.path, query));
    this.pageLimit = pageLimit;
    this._startPage = 1;
    this._hasNext = data.hasNext;
    if (!this.hasNext && data.leftNumber) {
      this._leftNumber = data.leftNumber as number;
    } else {
      this._leftNumber = undefined;
    }
  }

  /**
   * Please aware if you set a new limit, it will reset start page to 1.
   * @param {number} limit
   */
  public async setLimit(limit: number): Promise<void> {
    const query: PagerQuery = {
      startPage: 1,
      pageLimit: this.pageLimit,
      limit,
    };
    const { data } = await axios.get<PagerResponse>(appendQuery(this.path, query));
    this.limit = limit;
    this._startPage = 1;
    this._hasNext = data.hasNext;
    if (!this.hasNext && data.leftNumber) {
      this._leftNumber = data.leftNumber as number;
    } else {
      this._leftNumber = undefined;
    }
  }

  public get hasNext(): boolean {
    if (typeof this._hasNext === 'boolean') {
      return this._hasNext;
    }
    throw new Error('Please call setStartPage before call next page.');
  }

  public get leftNumber(): number {
    if (typeof this._leftNumber === 'number') {
      return this._leftNumber;
    }
    throw new Error('No need to get left number when hasNext.');
  }

  public get startPage(): number {
    if (typeof this._startPage === 'number') {
      return this._startPage;
    }
    throw new Error('Please call setStartPage.');
  }
}
