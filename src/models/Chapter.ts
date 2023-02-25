import { ChapterGroupDetails } from "./ChapterGroup";

export interface ChapterDetails {
    _id?: string;
    incomes?: string;
    expenses?: string;
    allotedBudget?: string;
    currentBalance?: string;
    chapterName?: string;
    chapterGroup?: ChapterGroupDetails;
    status?: string;
    createdBy?: string;
    colorValue?: string;
    themeValue?: string;
    createdAt?: string;
    updatedAt?: string;
    sharedWith?: string[];
    currency?: string;
  }