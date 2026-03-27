import React, { useState } from "react";
import { Calendar, FolderIcon } from 'lucide-react';
import { useApp } from "../../Context/useApp";
import { createNote } from "../../Api/Api";
import type { Note } from "../../Context/AppContext";

type Props = {
  onClose: () => void;
};

const NoteForm: React.FC<Props> = ({ onClose }) => {
  const { activeFolderId, activeFolderName, setNotes, setActiveNoteId } = useApp();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const currentDate = new Date().toLocaleDateString("en-GB");

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();

    if (!activeFolderId) return;

    try {
      const newNote: Note = await createNote({
        folderId: activeFolderId,
        title: title || "Untitled Note",
        content: content || "Start writing...",
      });

      const noteWithPreview: Note = {
        ...newNote,
        title : title || "Untitled Note",
        content : content || "start writing...",
        createdAt : new Date().toLocaleDateString(),
        preview : content.slice(0,100),
      };

      setNotes((prev) => [noteWithPreview, ...prev]);

      setActiveNoteId(newNote.id); 
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full w-250 px-8 py-5 overflow-y-auto">
    <form onSubmit={handleSubmit} className="p-6">

      <input
        type="text"
        placeholder="Enter title"
        style={{ fontFamily: 'var(--font-primary)'}}
        className="w-full text-(--add-bg) text-3xl font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />  

      <div className="flex items-center gap-25 mt-8 pb-2">
        <div className="flex items-center gap-4">
          <Calendar className="h-4 w-4 text-(--content-bg)" />
          <p
            style={{ fontFamily: 'var(--font-primary)', fontStyle: 'var(--font-semibold)' }}
            className="text-(--content-bg) text-sm pl-2 underline"
          >{currentDate}
          </p>
        </div>
        </div>
        
       <hr className="text-(--note-a-bg) w-250 h-px" />
      
            <div className="flex gap-20 pt-2">
              <div className="flex gap-4">
                <FolderIcon className="text-(--content-bg) h-5" />
                <p className="text-(--content-bg) text-sm underline">{activeFolderName}</p>
              </div>
            </div>
      

      <textarea
        placeholder="Write your note..."
        className="w-full border p-2 mt-2 h-40 text-(--isActive-bg) text-base pt-5"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-blue-500 text-white"
      >
        Submit
      </button>

    </form>
    </div>
  );
};

export default NoteForm;