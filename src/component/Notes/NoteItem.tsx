import React, { useEffect, useState } from "react";
import type { Note } from "../types/Types";
import { getNotes } from "../../Api/Api";
import { formatDate, getPreview } from "../utilis/helper";
import { useApp } from "../../Context/useApp";
import { useNavigate } from "react-router-dom";

type NotesResponse = {
  notes?: Note[];
  data?: Note[];
};

const NoteItem: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    selectedFolder,
    setSelectedNoteId,
    activeView,
    refreshNotes,
    selectedNoteId,
  } = useApp();

  const navigate = useNavigate();

  const getTitle = () => {
    if (activeView === "favorites") return "Favorites";
    if (activeView === "archived") return "Archived";
    if (activeView === "trash") return "Trash";
    if (selectedFolder) return selectedFolder.name;
    return "Notes";
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setNotes([]);

        let res;

        if (activeView === "favorites") {
          res = await getNotes({ favorite: true, limit: 300 });
        } else if (activeView === "archived") {
          res = await getNotes({ archived: true, limit: 300 });
        } else if (activeView === "trash") {
          res = await getNotes({ deleted: "true", limit: 300 });
        } else if (selectedFolder?.id) {
          res = await getNotes({ folderId: selectedFolder.id, limit: 300 });
        } else {
          res = await getNotes({ limit: 300 });
        }

        const raw: NotesResponse | Note[] = res?.data;

        let data: Note[];

        if (Array.isArray(raw)) {
          data = raw;
        } else {
          data = raw?.notes ?? raw?.data ?? [];
        }


        const safeData =
          activeView === "trash"
            ? data.filter(note => note.deletedAt !== null)
            : data.filter(note => note.deletedAt === null);
        const updated = safeData.map((note) => ({
          ...note,
          preview: getPreview(note.preview),
        }));

        setNotes(updated);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedFolder?.id, activeView, refreshNotes]);

  return (
    <div className="w-89 h-screen overflow-y-auto  overflow-x-hidden bg-(--middle-bg) px-4 pt-7 pb-4 ">
      <p className="text-lg font-semibold text-(--isActive-bg) pt-2 py-6">
        {getTitle()}
      </p>

      {loading && <p className="text-(--text-bg)">Loading...</p>}
      {!loading && notes.length === 0 && (
        <p className="text-(--text-bg)">No notes found</p>
      )}

      <div className="flex flex-col gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNoteId(note.id);
              if (selectedFolder) {
                navigate(`/folder/${selectedFolder.id}/note/${note.id}`);
              } else {
                navigate(`/note/${note.id}`);
              }
            }}
            className={`flex flex-col gap-2.5 p-4 rounded-lg cursor-pointer ${selectedNoteId === note.id
              ? "bg-(--note-a-bg)"
              : "bg-(--bg-mid)"
              }`}
          >
            <p className="font-semibold text-lg text-(--isActive-bg)">
              {note.title}
            </p>
            <div className="flex gap-4">
              <p className="text-base text-(--date-bg)">
                {formatDate(note.createdAt)}
              </p>
              <p className="text-base text-(--content-bg) truncate">
                {note.preview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteItem;