import React, { useEffect, useState, useRef } from "react";
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

  const [page, setPage] = useState(1);
  const limit = 8;
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const getParams = (pageNumber: number) => {
    const params: any = {
      page: pageNumber,
      limit,
    };

    if (activeView === "favorites") params.favorite = true;
    else if (activeView === "archived") params.archived = true;
    else if (activeView === "trash") params.deleted = "true";
    else if (selectedFolder?.id) params.folderId = selectedFolder.id;

    return params;
  };

  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setNotes([]);

        const res = await getNotes(getParams(1));

        const raw: NotesResponse | Note[] = res?.data;

        const data = Array.isArray(raw)
          ? raw
          : raw?.notes ?? raw?.data ?? [];

        const safeData =
          activeView === "trash"
            ? data.filter(n => n.deletedAt !== null)
            : data.filter(n => n.deletedAt === null);

        const updated = safeData.map(n => ({
          ...n,
          preview: getPreview(n.preview),
        }));

        setNotes(updated);
        setPage(1);
        setHasMore(updated.length === limit);

      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedFolder?.id, activeView, refreshNotes]);

  
  const fetchNextPage = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const nextPage = page + 1;

      const res = await getNotes(getParams(nextPage));

      const raw: NotesResponse | Note[] = res?.data;

      const data = Array.isArray(raw)
        ? raw
        : raw?.notes ?? raw?.data ?? [];

      const safeData =
        activeView === "trash"
          ? data.filter(n => n.deletedAt !== null)
          : data.filter(n => n.deletedAt === null);

      const updated = safeData.map(n => ({
        ...n,
        preview: getPreview(n.preview),
      }));

      setNotes(prev => [...prev, ...updated]);
      setPage(nextPage);
      setHasMore(updated.length === limit);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: containerRef.current, 
        rootMargin: "100px",
      }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [page, hasMore, loading]);

  return (
    <div
      ref={containerRef}
      className="w-89 h-screen overflow-y-auto overflow-x-hidden bg-(--middle-bg) px-4 pt-7 pb-4"
    >
      <p className="text-lg font-semibold text-(--isActive-bg) pt-2 py-6">
        {getTitle()}
      </p>

      

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
            className={`flex flex-col gap-2.5 p-4 rounded-lg cursor-pointer ${
              selectedNoteId === note.id
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

     
      {loading && (
        <p className="text-(--text-bg) p-2">Loading more...</p>
      )}

      
      <div ref={observerRef} className="h-10" />

      {!hasMore && (
        <p className="text-(--text-bg) p-2">No more notes</p>
      )}
    </div>
  );
};

export default NoteItem;