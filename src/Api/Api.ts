import axios from "axios";
import type { Note } from "../Context/AppContext";



const API = axios.create({
  baseURL: "https://nowted-server.remotestate.com",
});

//For Folders
export const getFolders = async () => {
  const res = await API.get("/folders");
  return res.data.folders;
}

//Notes for Folder
export const getNotes = async (folderId: string) => {
  const res = await API.get(`notes?folderId=${folderId}`)
  return res.data.notes;
}

//Recents
export const getRecents = async () => {
  const res = await API.get("/notes/recent")
  return res.data.recentNotes
}

//for updating note title
export const updateNoteTitle = async (id: string, title: string) => {
  const res = await API.patch(`/notes/${id}`, { title });
  return res.data;
};

//To create new folder
export const createNewFolder = async (name: string) => {
  const res = await API.post("/folders", { name });
  return res.data.folders;
}

export const getNotesDetail = async (noteId: string) => {
  const res = await API.get(`/notes/${noteId}`)
  return res.data.note;
}

export const createNote = async (
  data: {
    folderId: string;
    title: string;
    content: string;
  }
): Promise<Note> => {
  const res = await API.post<Note>("/notes", data);
  return res.data;
};


export default API;

