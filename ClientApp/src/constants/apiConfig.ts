import { HTTPHeaders } from '../types';
import { SETTINGS } from './settings';

export const jsonPatchConfig = {
  headers: {
    [HTTPHeaders.ContentType]: SETTINGS.HEADER_VALUE.JSON_TYPE,
  },
};
