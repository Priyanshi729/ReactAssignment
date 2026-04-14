import axios from "axios"
import type {  CreateFolderResponse, CreateNoteResponse, GetFoldersResponse, GetFullNoteResponse, GetNotes, GetNotesResponse, GetRecentResponse, MessageResponse, UpdateNoteResponse } from "../component/types/Types"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})



export const getRecent=async()=>{
    return await api.get<GetRecentResponse>('/notes/recent')
}

export const getFolders = async (params?: { deleted?: "true" | "false" }) => {
  return await api.get<GetFoldersResponse>('/folders', { params });
};

export const createFolder=async (name:string)=>{
    return await api.post<CreateFolderResponse>('/folders',{name})
}

export const getNotes = async (params: GetNotes) => {
  return await api.get<GetNotesResponse>("/notes", { params });
};

export const getNotesData = async (NotesId: string) => {
  return await api.get<GetFullNoteResponse>(`/notes/${NotesId}`);
};

export const createNote = async (data: {
  title: string;
  content: string;
  folderId: string;
}) => {
  return await api.post<CreateNoteResponse>("/notes", data);
};

export const updateNote = (id: string, data: {
  title?: string;
  content?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}) => api.patch<UpdateNoteResponse>(`/notes/${id}`, data);

export const deleteNote = async(id: string) => {
  return await api.delete<MessageResponse>(`/notes/${id}`);
};


export const restoreNote = async(id: string) => {
  return await api.post<UpdateNoteResponse>(`/notes/${id}/restore`);
};

export const deleteFolder =  async(id:string)=>{
  return await api.delete<MessageResponse>(`/folders/${id}`)
}


export const updateFolder = async (id: string, data: { name: string }) => {
  return await api.patch<CreateFolderResponse>(`/folders/${id}`, data);
};

export const restoreFolder = async (id: string) => {
  return await api.post<CreateFolderResponse>(`/folders/${id}/restore`);
};
