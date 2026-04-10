import axios from "axios"
import type {  GetNotes } from "../component/types/Types"

export const api=axios.create({
    baseURL:"https://nowted-server.remotestate.com"
})
export const getRecent=async()=>{
    return await api.get('/notes/recent')
}

export const getFolders = async (params?: { deleted?: "true" | "false" }) => {
  return await api.get('/folders', { params });
};

export const createFolder=async (name:string)=>{
    return await api.post('/folders',{name})
}

export const getNotes = async (params: GetNotes) => {
  return await api.get("/notes", { params });
};

export const getNotesData = async (NotesId: string) => {
  return await api.get(`/notes/${NotesId}`);
};

export const createNote = async (data: {
  title: string;
  content: string;
  folderId: string;
}) => {
  return await api.post("/notes", data);
};

export const updateNote = async(
  id: string,
  data: { isFavorite?: boolean; isArchived?: boolean },
) => {
  return await api.patch(`/notes/${id}`, data);
};

export const deleteNote = async(id: string) => {
  return await api.delete(`/notes/${id}`);
};


export const restoreNote = async(id: string) => {
  return await api.post(`/notes/${id}/restore`);
};

export const deleteFolder =  async(id:string)=>{
  return await api.delete(`/folders/${id}`)
}


export const updateFolder = async (id: string, data: { name: string }) => {
  return await api.patch(`/folders/${id}`, data);
};

export const restoreFolder = async (id: string) => {
  return await api.post(`/folders/${id}/restore`);
};



