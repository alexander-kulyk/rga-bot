//core
import axios, { AxiosPromise, AxiosProgressEvent } from 'axios';
//other
import { API, SETTINGS } from '../constants';
import { HTTPHeaders } from '../types';

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
        [HTTPHeaders.ContentType]: SETTINGS.HEADER_VALUE.FORM_DATA_TYPE,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        console.log('progressEvent', progressEvent);
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('Upload progress:', percentCompleted, '%');
        }
      },
    });
  },
};
