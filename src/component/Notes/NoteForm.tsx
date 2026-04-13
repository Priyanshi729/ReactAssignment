import React, { useEffect, useState } from "react";
import { Calendar, FolderIcon } from "lucide-react";
import { useApp } from "../../Context/useApp";
import { createNote, updateNote } from "../../Api/Api";
import { useLocation } from "react-router";

type Props = {
  onClose?: (createdNoteId?: string) => void;
};

const NoteForm: React.FC<Props> = ({ onClose }) => {
  const { selectedFolder, setSelectedNoteId, setRefreshNotes } = useApp();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-GB");

  const handleFirstChange = async () => {
    const folderId =
      selectedFolder?.id || location.pathname.split("/")[2];

    if (createdNoteId || !folderId) return;

    setCreatedNoteId("creating");

    try {
      const res = await createNote({
        folderId: folderId,
        title: "Untitled Note",
        content: "",
      });

      const newNote = res?.data?.note || res?.data;
      if (!newNote?.id) return;

      setCreatedNoteId(newNote.id);
      setSelectedNoteId(newNote.id);
      setRefreshNotes((prev) => !prev);

      onClose?.(newNote.id);
    } catch (err) {
      console.error(err);
      setCreatedNoteId(null);
    }
  };

  useEffect(() => {
    if (!createdNoteId) return;

    setIsSaving(true);

    const timer = setTimeout(async () => {
      try {
        await updateNote(createdNoteId, {
          title: title || "Untitled Note",
          content: content || "Start writing...",
        });

        setRefreshNotes((prev) => !prev);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, content, createdNoteId, setRefreshNotes]);

  return (
    <div className="h-full w-250 px-8 py-5 overflow-y-auto">
      <div className="p-6">
        <input
          type="text"
          placeholder="Enter title"
          style={{ fontFamily: "var(--font-primary)" }}
          className="w-full text-(--add-bg) text-3xl font-semibold focus:outline-none focus:ring-0"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleFirstChange();
          }}
        />

        <div className="flex items-center justify-between mt-8 pb-2">
          <div className="flex items-center gap-4">
            <Calendar className="h-4 w-4 text-(--content-bg)" />
            <p className="text-(--content-bg) text-sm pl-2">
              {currentDate}
            </p>
          </div>

          <p className="text-(--content-bg) text-xs pr-2">
            {createdNoteId ? (isSaving ? "Saving..." : "Saved") : ""}
          </p>
        </div>

        <hr className="text-(--note-a-bg) w-250 h-px" />

        <div className="flex gap-20 pt-2">
          <div className="flex gap-4">
            <FolderIcon className="text-(--content-bg) h-5" />
            <p className="text-(--content-bg) text-sm">
              {selectedFolder?.name || "No Folder"}
            </p>
          </div>
        </div>

        <textarea
          placeholder="Write your note..."
          className="w-full p-2 mt-2 h-60 text-(--isActive-bg) text-base pt-5 focus:outline-none focus:ring-0"
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