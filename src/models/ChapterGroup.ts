export interface ChapterGroupDetails {
  _id?: string;
  chapterGroup?: string;
  isActive?: boolean;
}

export enum activeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
