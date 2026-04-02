import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideLayout from './component/Sidebar/SideLayout';
import NotesDetail from './component/Notes/NoteDetail';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SideLayout />}>
        <Route index element={<Navigate to="/favorites" />} />
        <Route path="favorites" element={<NotesDetail />} />
        <Route path="archived" element={<NotesDetail />} />
        <Route path="trash" element={<NotesDetail />} />
        <Route path="folder/:folderId" element={<NotesDetail />} />
        <Route path="folder/:folderId/note/:noteId" element={<NotesDetail />} />
        <Route path="note/:noteId" element={<NotesDetail />} />
      </Route>
    </Routes>
  );
};

export default App;