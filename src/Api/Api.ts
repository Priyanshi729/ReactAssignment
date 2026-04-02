import axios from "axios"
import type { GetNotes } from "../component/types/Types"

export const api=axios.create({
    baseURL:"https://nowted-server.remotestate.com"
})
export const getRecent=async()=>{
    return await api.get('/notes/recent')
}

export const getFolders=  async()=>{
    return await api.get('/folders')
}

export const createFolder=(name:string)=>{
    return api.post('/folders',{name})
}

export const getNotes = async (params: GetNotes) => {
  return await api.get("/notes", { params });
};

export const getNotesData = async (NotesId: string) => {
  return await api.get(`/notes/${NotesId}`);
};

export const createNote = (data: {
  title: string;
  content: string;
  folderId: string;
}) => {
  return api.post("/notes", data);
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