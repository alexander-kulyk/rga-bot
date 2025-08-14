//core
import axios, { AxiosPromise } from 'axios';
//other
import { API } from '../constants';

const baseUrl = API.baseUrl;

interface IParams {
  file: File;
}

export const file = {
  upload: (params: IParams): AxiosPromise<void> => {
    const url = `${baseUrl}${API.upload.method}`;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', params.file);

    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
