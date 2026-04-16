import React, { useEffect, useRef, useState } from "react";
import { Archive, Calendar, FolderIcon, Star, Trash } from "lucide-react";
import { useApp } from "../../Context/useApp";
import {
  createNote,
  deleteNote,
  getNotesData,
  restoreNote,
  updateNote,
} from "../../Api/Api";
import { useLocation, useNavigate } from "react-router";
import type { FullNote } from "../types/Types";
import toast from "react-hot-toast";

type Props = {
  onClose?: (createdNoteId?: string) => void;
};

const NoteForm: React.FC<Props> = ({ onClose }) => {
  const { selectedFolder, setSelectedNoteId, setRefreshNotes } = useApp();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
 

 
  const [showNote, setShowNote] = useState<FullNote | null>(null);
  const [menu, setMenu] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const folderId = location.pathname.split("/")[2];

  const currentDate = new Date().toLocaleDateString("en-GB");

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFirstChange = async () => {
    const folderId = selectedFolder?.id || location.pathname.split("/")[2];

    if (createdNoteId || !folderId) return;

    setCreatedNoteId("creating");

    try {
      const res = await createNote({
        folderId,
        title: "Untitled Note",
        content: "",
      });

      const newNote = res?.data?.note || res?.data;
      if (!newNote?.id) return;

      const note: FullNote = {
        ...newNote,
        folderName: newNote.folder?.name || "No Folder",
      };

      setShowNote(note);
      setCreatedNoteId(newNote.id);
      setSelectedNoteId(newNote.id);
      setRefreshNotes((p) => !p);
      onClose?.(newNote.id);
    } catch {
      setCreatedNoteId(null);
    }
  };

  useEffect(() => {
    if (!createdNoteId) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);

      try {
        await updateNote(createdNoteId, {
          title: title || "Untitled Note",
          content: content || "Start writing...",
        });
        setRefreshNotes((p) => !p);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, content, createdNoteId,setRefreshNotes]);

  const handleFavorite = async () => {
    if (!showNote) return;

    await updateNote(showNote.id, {
      isFavorite: !showNote.isFavorite,
    });

    setShowNote({ ...showNote, isFavorite: !showNote.isFavorite });
    toast.success(
    showNote.isFavorite ?  "Removed from favorites" : "Added to favorites" 
  );
    setRefreshNotes((p) => !p);
  };

  const handleArchive = async () => {
    if (!showNote) return;

    await updateNote(showNote.id, {
      isArchived: !showNote.isArchived,
    });

    setShowNote({ ...showNote, isArchived: !showNote.isArchived });
    toast.success(
      showNote.isArchived ?  "Note Unarchived" : "Note archived " )
    setRefreshNotes((p) => !p);
    navigate(`/folder/${folderId}`, { replace: true });
    setSelectedNoteId(null);
  };

  const handleDelete = async () => {
    if (!showNote) return;

    await deleteNote(showNote.id);

    const res = await getNotesData(showNote.id); 

  setShowNote(res.data.note);
  toast.success("Moved to trash");

  setRefreshNotes((p) => !p);
  };

  const handleRestore = async () => {
    if (!showNote) return;

    await restoreNote(showNote.id);
    const res = await getNotesData(showNote.id);
    setShowNote(res.data.note)
     toast.success("Note restored ");
    setRefreshNotes((p) => !p);
    setSelectedNoteId(null);
   
  };

  if (showNote?.deletedAt) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-250 text-center">
        <div className="text-(--text-re) text-6xl mb-6">⟲</div>
        <h2 className="text-(--text-re) text-3xl font-semibold mb-4">
          Restore {showNote.title}
        </h2>

        <button
          onClick={handleRestore}
          className="px-6 py-3 bg-(--submit-bg) text-white rounded-lg"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-8 py-5 overflow-y-auto">
      <div className="p-6">

        <div className="flex items-center justify-between  ">
          <input
            type="text"
            placeholder="Enter title"
            className="w-full text-(--add-bg) text-3xl font-semibold focus:outline-none"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleFirstChange();
            }}
          />

          <div className="relative"  ref={menuRef}>
            <button
              onClick={() => setMenu((p) => !p)}
              className="w-6 h-6  flex items-center justify-center rounded-full text-(--text-bg) border border-gray-500"
            >
              ⋯
            </button>

            {menu && (
              <div className="bg-(--menu-bg) flex flex-col gap-2 p-3 absolute right-0 top-7 z-50 rounded-xl w-48">
                <button onClick={handleFavorite} className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)">
                  <Star className="w-4 h-4" />
                  {showNote?.isFavorite ? "Remove favorite" : "Add favorite"}
                </button>

                <button onClick={handleArchive} className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)">
                  <Archive className="w-4 h-4" />
                  {showNote?.isArchived ? "Unarchive" : "Archive"}
                </button>

                <hr className="border-(--button-bg)" />

                <button onClick={handleDelete} className="flex items-center gap-3 px-3 py-2 text-sm text-(--add-bg)">
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pb-2">
          <div className="flex items-center gap-6">
            <Calendar className="h-4 w-4 text-(--content-bg)" />
            <p className="text-(--content-bg) text-sm">Date</p>
            <p className="text-(--add-bg) text-sm">{currentDate}</p>
          </div>
          

          <p className="text-(--content-bg) text-xs">
            {createdNoteId ? (isSaving ? "Saving..." : "Saved") : ""}
          </p>
        </div>

        <hr className="text-(--note-a-bg) w-full h-px" />

        <div className="flex gap-20 pt-2">
          <div className="flex gap-4">
            <FolderIcon className="text-(--content-bg) h-5" />
            <p className="text-(--content-bg) text-sm">Folder</p>
            <p className="text-(--add-bg) text-sm">
              {selectedFolder?.name || "No Folder"}
            </p>
          </div>
        </div>

        <textarea
          placeholder="Write your note..."
          className="w-full p-2 mt-2 h-60 text-(--isActive-bg) focus:outline-none"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            
            handleFirstChange();
          }}
        />
      </div>
    </div>
  );
};

export default NoteForm;