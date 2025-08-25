//core
import axios, { AxiosPromise } from 'axios';
//other
import { IFileOptionsResponse } from '../types';
import { API } from '../constants';

const baseUrl = API.baseUrl;

export const fileOptions = {
  get: (): AxiosPromise<IFileOptionsResponse> => {
    const url = `${baseUrl}${API.fileOptions.method}`;
    return axios.get(url);
  },
};
