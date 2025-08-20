import { IModelConfigs } from './IModelConfigs';

export interface IModelConfigsResponse {
  configs: IModelConfigs[];
  message: string;
  success: boolean;
}
