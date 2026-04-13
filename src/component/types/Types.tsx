export type Note = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;

  folderId: string;
  folderName?: string;   
  folder?: {
    id: string;
    name: string;
  };

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

  folder?: {            
    id: string;
    name: string;
  };

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

export type NoteParam = {
  page : number;
  limit : number;
  favorite?: boolean;
  archived?: boolean;
  deleted? : deletedNote;
  folderId?: string;
}

export type deletedNote = "true" | "false";

export type GetNotes = {
  folderId?: string;
  favorite?: boolean;
  archived?: boolean;
  deleted?: deletedNote;
  limit?: number;
  page?: number;
  search?:string;
};

export type GetFoldersResponse = {
  folders: folder[];
};

export type GetRecentResponse = {
  notes: Note[];
};

export type CreateFolderResponse = {
  folder: folder;
};

export type GetFullNoteResponse = {
  note: FullNote;
};

export type GetNotesResponse = {
  notes: Note[];
};

export type CreateNoteResponse = {
  note: FullNote;
};

export type UpdateNoteResponse = {
  note: FullNote;
};

export type MessageResponse = {
  message: string;
};

 
