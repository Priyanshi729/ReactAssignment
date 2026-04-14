import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type { folder, Note } from "../types/Types";
import { getRecent } from "../../Api/Api";
import { useApp } from "../../Context/useApp";
import { useNavigate } from "react-router-dom";

const Recents: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const {
        folders,
        setSelectedFolder,
        setSelectedNoteId,
        selectedNoteId,
        setActiveView
    } = useApp();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await getRecent();
                const raw = res?.data;
                const data =
                    raw?.notes ??
                    raw?.data ??
                    raw?.recentNotes ??
                    (Array.isArray(raw) ? raw : []);
                setNotes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.log("Fetch error:", err);
                setNotes([]);
            }
        };
        fetchRecent();
    }, []);

    const handleUpdateNote = async (id: string) => {
        if (!editTitle.trim()) {
            setEditId(null);
            return;
        }
        try {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, title: editTitle } : note
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setEditId(null);
        }
    };

    const getFolderName = (folderId: string) => {
        const folder = folders.find((f: folder) => f.id === folderId);
        return folder?.name || "Untitled Folder";
    };

    const handleNotesClick = (note: Note) => {
        setSelectedNoteId(note.id);
        const folderName = getFolderName(note.folderId);
        setSelectedFolder({
            id: note.folderId,
            name: folderName,
        });
        setActiveView(null);
        navigate(`/folder/${note.folderId}/note/${note.id}`);
    };

    return (
        <div
            style={{ fontFamily: "var(--font-primary)" }}
            className="w-80 h-39.5 pl-6 pt-2"
        >
            <p className="text-(--text-bg) font-semibold text-sm">
                Recents
            </p>

            {(notes?.length ?? 0) === 0 && (
                <p className="text-(--text-bg) text-sm pt-2">
                    No recent notes
                </p>
            )}

            {notes?.map((note) => {
                const isActive = selectedNoteId === note.id;
                const isEditing = editId === note.id;

                return (
                    <div
                        key={note.id}
                        onClick={() => handleNotesClick(note)}
                        className={`flex items-center gap-3.75 pt-2.5 pr-5 pb-2.5 cursor-pointer ${
                            isActive
                                ? "bg-(--note-a-bg) text-(--isActive-bg)"
                                : "text-(--text-bg) hover:bg-(--hover-bg)"
                        }`}
                    >
                        <FileText className="w-5 h-5 text(--text-bg)" />

                        {isEditing ? (
                            <input
                                value={editTitle}
                                autoFocus
                                onChange={(e) =>
                                    setEditTitle(e.target.value)
                                }
                                onBlur={() =>
                                    handleUpdateNote(note.id)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        handleUpdateNote(note.id);
                                    if (e.key === "Escape")
                                        setEditId(null);
                                }}
                                className="bg-(--sidebar-bg) text-base px-1 rounded outline-none text-white"
                            />
                        ) : (
                            <p
                                onDoubleClick={() => {
                                    setEditId(note.id);
                                    setEditTitle(note.title);
                                }}
                                className={`text-base font-semibold ${
                                    isActive
                                        ? "text-(--isActive-bg)"
                                        : " text-(--text-bg)"
                                }`}
                            >
                                {note.title}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Recents;