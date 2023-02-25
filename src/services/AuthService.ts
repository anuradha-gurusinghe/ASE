import axios from 'axios';
import { AppResponse } from '../models/Response';
import { Util } from '../Util';

export interface UserLoginData {
  email: string;
  password: string;
}

export class AuthService {
  //keys
  private static readonly TOKEN_KEY = 'token';

  //log in
  public static async userLogin(
    userLoginData: UserLoginData
  ): Promise<AppResponse<any>> {
    const ep = Util.apiPublicUrl('adminlogin');

    const res = await axios.post<UserLoginData, AppResponse<any>>(
      ep,
      userLoginData
    );

    if (res.success && res.data.role === 'SUPER_ADMIN') {
      //console.log(res.data.token);
      localStorage.setItem(AuthService.TOKEN_KEY, res.data.token); //TODO read token from cookie and remove this implementation
    }

    return res;
  }

  public static async getMe(): Promise<AppResponse<any>> {
    const ep = Util.apiAuthUrl('me');

    const res = await axios.get<void, AppResponse<any>>(ep);
    if (res.error) {
      localStorage.removeItem(AuthService.TOKEN_KEY);
    }

    return res;
  }

  public static getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY); //TODO read token from cookie and remove this implementation
  }
}
