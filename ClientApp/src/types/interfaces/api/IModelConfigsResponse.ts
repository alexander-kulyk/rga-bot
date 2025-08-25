import { IResponse } from './Common';
import { IModelConfigs } from './IModelConfigs';

export interface IModelConfigsResponse extends IResponse {
  configs: IModelConfigs[];
}
