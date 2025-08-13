//core
import axios, { AxiosPromise } from 'axios';
//other
import { API, jsonPatchConfig } from '../constants';
import { IModelResponse } from '../types';

const baseUrl = API.baseUrl;

interface IParams {
  question: string;
}

export const model = {
  sendAsk: (question: IParams): AxiosPromise<IModelResponse> => {
    const url = `${baseUrl}${API.ask.method}`;
    return axios.post(url, question, jsonPatchConfig);
  },
};
