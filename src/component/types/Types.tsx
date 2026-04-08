import type { deleteFolder } from "../../Api/Api";

export type Note = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;

  folderId: string;
  folderName?: string;   

  isFavorite?: boolean;  
  isArchived?: boolean;  
  deletedAt?: string | null;
};

export type FullNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;

  folderId?: string;
  folderName?: string;  

  isFavorite: boolean;  
  isArchived?: boolean;
  deletedAt? : string | null;

  folderDeletedAt?: string | null;
};

export type folder = {
  id: string;
  name: string;
  deletedAt?: string | null;
};



export type deletedNote = "true" | "false";

export type GetNotes = {
  folderId?: string;
  favorite?: boolean;
  archived?: boolean;
  deleted?: deletedNote;
  limit?: number;
};