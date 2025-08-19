//core
import axios, { AxiosPromise } from 'axios';
//other
import { IModelConfigs } from '../types';
import { API, jsonPatchConfig } from '../constants';

const baseUrl = API.baseUrl;

export const modelConfigs = {
  get: (): AxiosPromise<IModelConfigs> => {
    const url = `${baseUrl}${API.modelConfigs.method}`;
    return axios.get(url);
  },
  update: (data: IModelConfigs): AxiosPromise<IModelConfigs> => {
    const url = `${baseUrl}${API.modelConfigs.method}`;
    return axios.put(url, data, jsonPatchConfig);
  },
};
