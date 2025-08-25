import { IResponse } from './Common';

interface IOptions {
  _id: string;
  name: string;
  order: number;
  isDefault: boolean;
}

export interface IFileOptionsResponse extends IResponse {
  options: IOptions[];
}
