import axios from 'axios';
import { CategoryDetails } from 'src/models/Category';
import { ChapterDetails } from 'src/models/Chapter';
import { ChapterGroupDetails } from 'src/models/ChapterGroup';
import { UserDetails } from 'src/models/User';
import { AppResponse } from '../models/Response';
import { Util } from '../Util';
import { IconDetails } from './../models/Icon';

export class ManagementServices {
  public static async getAllUsers(
    limit?: number,
    offset?: number
  ): Promise<AppResponse<UserDetails[]>> {
    const url = Util.apiAuthUrl(`getAllUsers`);
    const res = await axios.get<void, AppResponse<UserDetails[]>>(url);
    console.log(res.data);
    return res;
  }

  public static async updateUser(data: any): Promise<AppResponse<UserDetails>> {
    const url = Util.apiAuthUrl(`updateCustomerByAdmin`);
    const res = await axios.post<void, AppResponse<UserDetails>>(url, data);
    return res;
  }

  public static async getAllChapters(
    limit?: number,
    offset?: number
  ): Promise<AppResponse<ChapterDetails[]>> {
    const url = Util.apiAuthUrl(`getAllChaptersbyadmin`);
    const res = await axios.get<void, AppResponse<ChapterDetails[]>>(url);
    console.log(res.data);
    return res;
  }

  public static async getAllCategories(
    limit?: number,
    offset?: number
  ): Promise<AppResponse<CategoryDetails[]>> {
    const url = Util.apiAuthUrl(`getAllCategoriesbyadmin`);
    const res = await axios.get<void, AppResponse<CategoryDetails[]>>(url);
    console.log(res.data);
    return res;
  }

  public static async updateCategoryStatus(
    data: any
  ): Promise<AppResponse<CategoryDetails>> {
    const url = Util.apiAuthUrl(`update-category`);
    const res = await axios.post<void, AppResponse<CategoryDetails>>(
      url,
      data
    );
    return res;
  }

  public static async createCategory(
    data: any
  ): Promise<AppResponse<CategoryDetails>> {
    const url = Util.apiAuthUrl(`create-category`);
    const res = await axios.post<void, AppResponse<CategoryDetails>>(
      url,
      data
    );
    return res;
  }

  public static async updateCategory(
    data: any
  ): Promise<AppResponse<CategoryDetails>> {
    const url = Util.apiAuthUrl(`update-category-byAdmin`);
    const res = await axios.post<void, AppResponse<CategoryDetails>>(
      url,
      data
    );
    return res;
  }

  public static async deleteCategory(
    categoryId: any
  ): Promise<AppResponse<CategoryDetails>> {
    const url = Util.apiAuthUrl(`delete-category/${categoryId}`);
    const res = await axios.delete<void, AppResponse<CategoryDetails>>(url);
    return res;
  }

  public static async getAllChapterGroups(
    limit?: number,
    offset?: number
  ): Promise<AppResponse<ChapterGroupDetails[]>> {
    const url = Util.apiAuthUrl(`groups`);
    const res = await axios.get<void, AppResponse<ChapterGroupDetails[]>>(url);
    console.log(res.data);
    return res;
  }

  public static async updateChapterGroup(
    data: any
  ): Promise<AppResponse<ChapterGroupDetails>> {
    const url = Util.apiAuthUrl(`update-group-status`);
    const res = await axios.post<void, AppResponse<ChapterGroupDetails>>(
      url,
      data
    );
    return res;
  }

  public static async createChapterGroup(
    data: any
  ): Promise<AppResponse<ChapterGroupDetails>> {
    const url = Util.apiAuthUrl(`create-chapter-group`);
    const res = await axios.post<void, AppResponse<ChapterGroupDetails>>(
      url,
      data
    );
    return res;
  }

  public static async deleteChapterGroup(
    groupId: any
  ): Promise<AppResponse<ChapterGroupDetails>> {
    const url = Util.apiAuthUrl(`delete-group/${groupId}`);
    const res = await axios.delete<void, AppResponse<ChapterGroupDetails>>(url);
    return res;
  }

  public static async createIcon(
    data: any
  ): Promise<AppResponse<IconDetails>> {
    const url = Util.apiAuthUrl(`create-icon`);
    const res = await axios.post<void, AppResponse<IconDetails>>(
      url,
      data
    );
    return res;
  }

  public static async deleteIcon(
    iconId: any
  ): Promise<AppResponse<IconDetails>> {
    const url = Util.apiAuthUrl(`delete-icon/${iconId}`);
    const res = await axios.delete<void, AppResponse<IconDetails>>(url);
    return res;
  }

  public static async getAllIcons(
    limit?: number,
    offset?: number
  ): Promise<AppResponse<IconDetails[]>> {
    const url = Util.apiAuthUrl(`icons`);
    const res = await axios.get<void, AppResponse<IconDetails[]>>(url);
    console.log(res.data);
    return res;
  }

  public static async updateIcon(
    data: any
  ): Promise<AppResponse<IconDetails>> {
    const url = Util.apiAuthUrl(`update-icon-status`);
    const res = await axios.post<void, AppResponse<IconDetails>>(
      url,
      data
    );
    return res;
  }
}
