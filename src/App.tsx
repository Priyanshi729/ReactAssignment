import React from 'react';
import { Toaster } from "react-hot-toast";
import { Routes, Route} from 'react-router-dom';
import SideLayout from './component/Sidebar/SideLayout';
import NotesDetail from './component/Notes/NoteDetail';


const App: React.FC = () => {
  return (
    <>
    <Toaster position='top-center'/>
    <Routes>
      <Route path="/" element={<SideLayout />}>
        <Route path="favorites" element={<NotesDetail />} />
        <Route path="favorites/:folderId/:noteId" element={<NotesDetail />} />
        <Route path="archived" element={<NotesDetail />} />
        <Route path="archived/:folderId/:noteId" element={<NotesDetail />} />
        <Route path="trash" element={<NotesDetail />} />
        <Route path="trash/:folderId/:noteId" element={<NotesDetail />} />
        <Route path="folder/:folderId" element={<NotesDetail />} />
        <Route path="folder/:folderId/note/:noteId" element={<NotesDetail />} />
        <Route path="note/:noteId" element={<NotesDetail />} />
      </Route>
    </Routes></>
    
  );
};

export default App;