import { environment } from './environment/environment.example';
import axios, { AxiosHeaders } from 'axios';

export class Util {
  public static apiPublicUrl(path: string): string {
    return environment.api_url + '/api/public/' + path;
  }

  public static apiAuthUrl(path: string): string {
    return environment.api_url + '/api/auth/' + path;
  }

  public static initAxios(): void {
    axios.interceptors.request.use((req) => {
      //   req.headers.authorization = 'Bearer ' + localStorage.getItem('token');
      (req.headers as AxiosHeaders).set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      return req;
    });

    axios.interceptors.response.use(
      function (response) {
        return response.data;
      },
      function (error) {
        return { success: false, data: undefined, error: error };
      }
    );
  }
}

Util.initAxios();
