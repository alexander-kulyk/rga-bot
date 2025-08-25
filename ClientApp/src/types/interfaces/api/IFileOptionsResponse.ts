import { IResponse } from './Common';
import { IFileOptions } from './IFileOptions';

export interface IFileOptionsResponse extends IResponse {
  options: IFileOptions[];
}
