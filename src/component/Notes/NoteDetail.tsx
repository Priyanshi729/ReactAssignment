import {
  Archive,
  Calendar,
  FileText,
  Folder,
  Star,
  Trash,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { FullNote } from "../types/Types";
import {
  getNotesData,
  updateNote,
  restoreNote,
  deleteNote,
} from "../../Api/Api";
import { useApp } from "../../Context/useApp";
import NoteForm from "./NoteForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const NotesDetail: React.FC = () => {
  const {
    selectedNoteId,
    setRefreshNotes,
    setSelectedNoteId,
    selectedFolder,
  } = useApp();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const location = useLocation();

  const [showNote, setShowNote] = useState<FullNote | null>(null);
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState<"view" | "create">("view");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedNoteId(null);
    setShowNote(null);
    setTitle("");
    setContent("");
  }, [selectedFolder?.id, location.pathname, setSelectedNoteId]);

  useEffect(() => {
    if (noteId === "new") {
      setMode("create");
      setSelectedNoteId(null);
      setShowNote(null);
      return;
    }

    setMode("view");
    setSelectedNoteId(noteId || null);
  }, [noteId, setSelectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId || mode === "create") return;

    const fetchNote = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getNotesData(selectedNoteId);
        const note = res?.data?.note;

        if (!note) throw new Error("Note not found");

        const normalized: FullNote = {
          ...note,
          folderName: note.folder?.name || note.folderName || "No Folder",
        };

        setShowNote(normalized);
        setTitle(normalized.title || "");
        setContent(normalized.content || "");
      } catch {
        setError("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [selectedNoteId, mode, location.pathname]);

  const handleSave = async (newTitle: string, newContent: string) => {
    if (!showNote) return;

    await updateNote(showNote.id, {
      title: newTitle,
      content: newContent,
    });

    setRefreshNotes((p) => !p);
  };

  const handleArchive = async () => {
    if (!showNote) return;

    await updateNote(showNote.id, {
      isArchived: !showNote.isArchived,
    });

    setShowNote((prev) =>
      prev ? { ...prev, isArchived: !prev.isArchived } : prev
    );

    setRefreshNotes((p) => !p);
    navigate("/");
  };

  const handleFavorite = async () => {
    if (!showNote) return;

    await updateNote(showNote.id, {
      isFavorite: !showNote.isFavorite,
    });

    setShowNote((prev) =>
      prev ? { ...prev, isFavorite: !prev.isFavorite } : prev
    );

    setRefreshNotes((p) => !p);
  };

  const handleDelete = async () => {
    if (!showNote) return;

    await deleteNote(showNote.id);

    setShowNote((prev) =>
      prev
        ? {
          ...prev,
          deletedAt: new Date().toISOString(),
          content: "",
        }
        : prev
    );

    setRefreshNotes((p) => !p);
  };

  if (mode === "create") return <NoteForm />;

  if (!selectedNoteId)
    return (
      <div className="flex flex-col justify-center items-center pl-65">
        <FileText className="text-(--text-re) w-20 h-20" />
        <p className="text-(--text-re) text-3xl font-semibold p-4">
          Select a note to view
        </p>
        <p className="text-(--text-bg)">
          Choose a note or create a new one.
        </p>
      </div>
    );

  if (loading && !showNote)
    return <div className="p-10 text-white animate-pulse">Loading note...</div>;

  if (error)
    return <div className="p-10 text-red-500">{error}</div>;

  if (!showNote) return null;

  if (showNote.deletedAt) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-250 text-center">
        <div className="text-(--text-re) text-6xl mb-6">⟲</div>
        <h2 className="text-(--text-re) text-3xl font-semibold mb-4">
          Restore "{showNote.title}"
        </h2>

        <button
          onClick={async () => {
            await restoreNote(showNote.id);
            setRefreshNotes((p) => !p);
            setSelectedNoteId(null);
            navigate("/");
          }}
          className="px-6 py-3 bg-(--submit-bg) text-white rounded-lg"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-8 py-5 overflow-y-auto">

      <div className="flex items-center justify-between">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleSave(e.target.value, content);
          }}
          className="text-(--add-bg) text-3xl bg-transparent outline-none w-full"
        />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenu((p) => !p)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-(--text-bg) border border-gray-500"
          >
            ⋯
          </button>

          {menu && (
            <div className="bg-(--menu-bg) flex flex-col gap-2 p-3 absolute right-0 top-7 z-50 rounded-xl w-48">
              <button
                onClick={() => { handleFavorite(); setMenu(false); }}
                disabled={loading}
                className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)"
              >
                <Star className="w-4 h-4" />
                {showNote.isFavorite ? 'Remove favorite' : 'Add to favorites'}
              </button>
              <button
                onClick={() => { handleArchive(); setMenu(false); }}
                disabled={loading}
                className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)"
              >
                <Archive className="w-4 h-4" />
                {showNote.isArchived ? 'UnArchived' : 'Archived'}
              </button>
              <hr className="border-(--button-bg)" />
              <button
                onClick={() => { handleDelete(); setMenu(false); }}
                disabled={loading}
                className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-20 mt-8 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-(--content-bg)" />
          <p className="text-(--content-bg) text-sm">Date</p>
        </div>

        <p className="text-(--add-bg) text-sm">
          {new Date(showNote.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>

      <hr className="w-full" />

      <div className="flex gap-20 pt-2">
        <div className="flex gap-2">
          <Folder className="h-4 w-4 text-(--content-bg)" />
          <p className="text-(--content-bg) text-sm">Folder</p>
        </div>

        <p className="text-(--add-bg) text-sm">
          {showNote.folderName || "No Folder"}
        </p>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleSave(title, e.target.value);
        }}
        className="w-full h-[70vh] mt-5 bg-transparent outline-none resize-none text-(--isActive-bg)"
      />
    </div>
  );
};

export default NotesDetail;