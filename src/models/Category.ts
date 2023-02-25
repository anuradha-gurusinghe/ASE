import { ChapterGroupDetails } from "./ChapterGroup";
import { IconDetails } from "./Icon";

export interface CategoryDetails {
    _id?: string;
    category?: string;
    isActive?: Boolean;
    color?:string;    
    iconValue?: IconDetails;
    chapterGroup?: ChapterGroupDetails;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  }