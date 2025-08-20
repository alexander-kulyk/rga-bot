//core
import axios, { AxiosPromise } from 'axios';
//other
import { IModelConfigs, IModelConfigsResponse } from '../types';
import { API, jsonPatchConfig } from '../constants';

const baseUrl = API.baseUrl;

export const modelConfigs = {
  get: (): AxiosPromise<IModelConfigsResponse> => {
    const url = `${baseUrl}${API.modelConfigs.method}`;
    return axios.get(url);
  },
  update: (data: IModelConfigs): AxiosPromise<IModelConfigs> => {
    const url = `${baseUrl}${API.modelConfigs.method}`;
    return axios.put(url, data, jsonPatchConfig);
  },
};
