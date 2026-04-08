import React, { useState } from "react";
import { Calendar, FolderIcon } from "lucide-react";
import { useApp } from "../../Context/useApp";
import { createNote } from "../../Api/Api";
import type { Note } from "../types/Types";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose?: (createdNoteId?: string) => void;
};

const NoteForm: React.FC<Props> = ({ onClose }) => {
  const { selectedFolder, setSelectedNoteId, setRefreshNotes } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const currentDate = new Date().toLocaleDateString("en-GB");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFolder?.id) {
      alert("Please select a folder before creating a note.");
      return;
    }

    try {
      const res = await createNote({
        folderId: selectedFolder.id,
        title: title || "Untitled Note",
        content: content || "Start writing...",
      });

      const newNote: Note | undefined = res?.data?.note || res?.data;
      if (!newNote || !newNote.id) {
        throw new Error("API did not return a valid note object");
      }

     
      setSelectedNoteId(null);
      setRefreshNotes((prev) => !prev); 
      navigate('/');
      onClose?.(newNote.id);
    } catch (err) {
      console.error("Failed to create note:", err);
      alert("Failed to create note. Check console for details.");
    }
  };

  return (
    <div className="h-full w-250 px-8 py-5 overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6">
        <input
          type="text"
          placeholder="Enter title"
          style={{ fontFamily: "var(--font-primary)" }}
          className="w-full text-(--add-bg) text-3xl font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex items-center gap-25 mt-8 pb-2">
          <div className="flex items-center gap-4">
            <Calendar className="h-4 w-4 text-(--content-bg)" />
            <p className="text-(--content-bg) text-sm pl-2 ">{currentDate}</p>
          </div>
        </div>

        <hr className="text-(--note-a-bg) w-250 h-px" />

        <div className="flex gap-20 pt-2">
          <div className="flex gap-4">
            <FolderIcon className="text-(--content-bg) h-5" />
            <p className="text-(--content-bg) text-sm ">
              {selectedFolder?.name || "No Folder"}
            </p>
          </div>
        </div>

        <textarea
          placeholder="Write your note..."
          className="w-full border p-2 mt-2 h-60 text-(--isActive-bg) text-base pt-5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="mt-3 px-4 py-2 bg-(--submit-bg) text-white">
          + Add Note
        </button>
      </form>
    </div>
  );
};

export default NoteForm;