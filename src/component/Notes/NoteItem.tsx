import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { Note, NoteParam } from "../types/Types";
import { getNotes } from "../../Api/Api";
import { formatDate, getPreview } from "../utilis/helper";
import { useApp } from "../../Context/useApp";
import { useNavigate, useLocation } from "react-router-dom";

type NotesResponse = {
  notes?: Note[];
  data?: Note[];
};

const NoteItem: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
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
  const location = useLocation();

  const currentView = useMemo(() => {
    if (activeView) return activeView;
    if (location.pathname.startsWith("/favorites")) return "favorites";
    if (location.pathname.startsWith("/archived")) return "archived";
    if (location.pathname.startsWith("/trash")) return "trash";
    return null;
  }, [activeView, location.pathname]);

  const shouldFetch = useMemo(
    () => currentView !== null || Boolean(selectedFolder?.id),
    [currentView, selectedFolder?.id]
  );

  const getTitle = () => {
    if (currentView === "favorites") return "Favorites";
    if (currentView === "archived") return "Archived";
    if (currentView === "trash") return "Trash";
    if (selectedFolder) return selectedFolder.name;
    
  };

  const getParams = useCallback((pageNumber: number) => {
    const params: NoteParam = {
      page: pageNumber,
      limit,
    };

    if (currentView === "favorites") params.favorite = true;
    else if (currentView === "archived") params.archived = true;
    else if (currentView === "trash") params.deleted = "true";
    else if (selectedFolder?.id) params.folderId = selectedFolder.id;

    return params;
  },[currentView,selectedFolder]);

  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!shouldFetch) return;

      try {
        setLoading(true);
        setNotes([]);

        const res = await getNotes(getParams(1));

        const raw: NotesResponse | Note[] = res?.data;

        const data = Array.isArray(raw)
          ? raw
          : raw?.notes ?? raw?.data ?? [];

        const safeData =
          currentView === "trash"
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
  }, [getParams, refreshNotes, shouldFetch]);

  
  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore || !shouldFetch) return;

    try {
      setLoading(true);

      const nextPage = page + 1;

      const res = await getNotes(getParams(nextPage));

      const raw: NotesResponse | Note[] = res?.data;

      const data = Array.isArray(raw)
        ? raw
        : raw?.notes ?? raw?.data ?? [];

      const safeData =
        currentView === "trash"
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
  },[page,hasMore,loading,getParams,shouldFetch]);

  
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
  }, [fetchNextPage]);

  const sortedNotes = useMemo(() => {
  if (currentView === "trash") {
    return [...notes].sort(
      (a, b) =>
        new Date(b.deletedAt || 0).getTime() -
        new Date(a.deletedAt || 0).getTime()
    );
  }
  return notes;
}, [notes, currentView]);

  return (
    <div
      ref={containerRef}
      className="w-89 h-screen overflow-y-auto overflow-x-hidden bg-(--middle-bg) px-4 pt-7 pb-4"
    >
      <p className="text-lg font-semibold text-(--isActive-bg) pt-2 py-6">
        {getTitle()}
      </p>

      

      <div className="flex flex-col gap-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNoteId(note.id);
              if (currentView === "favorites") {
                navigate(`/favorites/${note.folderId}/${note.id}`);
              } else if (currentView === "archived") {
                navigate(`/archived/${note.folderId}/${note.id}`);
              } else if (currentView === "trash") {
                navigate(`/trash/${note.folderId}/${note.id}`);
              } else if (selectedFolder) {
                navigate(`/folder/${selectedFolder.id}/note/${note.id}`);
              } else {
                navigate(`/note/${note.id}`);
              }
            }}
            className={`flex flex-col gap-2.5 p-4 rounded-lg cursor-pointer ${
              selectedNoteId === note.id
                ? "bg-(--note-a-bg)"
                : "bg-(--bg-mid) hover:bg-(--hover-bg)"
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