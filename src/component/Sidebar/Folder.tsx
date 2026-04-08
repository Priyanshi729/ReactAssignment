import React, { useEffect, useState } from "react";
import {
  Folder as FolderIcon,
  FolderPlus,
  FolderOpen,
  Trash as TrashIcon,
} from "lucide-react";
import { useApp } from "../../Context/useApp";
import {
  getFolders,
  createFolder as apiCreateFolder,
  deleteFolder,
  restoreFolder,
} from "../../Api/Api";
import { useNavigate } from "react-router";

const Folder: React.FC = () => {
  const {
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    setSelectedNoteId,
    setRefreshNotes,
    setActiveView,
    activeView,
  } = useApp();

  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const safeFolders = Array.isArray(folders) ? folders : [];
  const navigate = useNavigate();

  const filteredFolders = safeFolders.filter(f =>
    activeView === "trash" ? f.deletedAt : !f.deletedAt
  );

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders(
          activeView === "trash" ? { deleted: "true" } : { deleted: "false" }
        );
        const data = res?.data?.folders ?? res?.data ?? [];
        const normalized = Array.isArray(data)
          ? data.map((f) => ({
            id: String(f.id),
            name: f.name,
            deletedAt: f.deletedAt ?? null,
          })).filter(f => activeView === "trash" ? f.deletedAt : !f.deletedAt)
          : [];

        setFolders(normalized);

        if (normalized.length > 0 && !selectedFolder && activeView !== "trash") {
          setSelectedFolder(normalized[0]);
        } else if (activeView === "trash") {
          setSelectedFolder(null);
        }
      } catch (err) {
        console.error(err);
        setFolders([]);
      }
    };

    fetchFolders();
  }, [activeView]);

  useEffect(() => {
    if (filteredFolders.length > 0) {
      setSelectedFolder(filteredFolders[0]);
    } else {
      setSelectedFolder(null);
    }
  }, [activeView, folders]);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await apiCreateFolder(newFolderName);
      const rawFolder = res?.data?.folder || res?.data;

      const newFolder = {
        id: String(rawFolder?.id ?? Date.now()),
        name: rawFolder?.name ?? newFolderName,
        deletedAt: null,
      };

      setFolders((prev) => [newFolder, ...(prev || [])]);
      setSelectedFolder({ id: newFolder.id, name: newFolder.name });
      setSelectedNoteId(null);
      setRefreshNotes((prev) => !prev);
      setNewFolderName("");
      setShowInput(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolder(id);

      setFolders((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, deletedAt: new Date().toISOString() } : f
        )
      );
      setSelectedFolder(null);
      setSelectedNoteId(null);
      setRefreshNotes((prev) => !prev);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreFolder = async (id: string) => {
    try {
      await restoreFolder(id);
      setRefreshNotes((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-80 h-64 pl-3 pr-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-3 sticky top-0 bg-(--sidebar-bg) z-10">
        <p className="text-(--text-bg) text-sm font-semibold pl-3">
          {activeView === "trash" ? "Deleted Folders" : "Folders"}
        </p>
        {activeView !== "trash" && (
          <FolderPlus
            onClick={() => setShowInput(true)}
            className="w-5 h-5 cursor-pointer text-(--text-bg) hover:text-(--plus-hover) transition"
          />
        )}
      </div>

      {showInput && activeView !== "trash" && (
        <div className="py-3">
          <input
            type="text"
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddFolder();
              if (e.key === "Escape") setShowInput(false);
            }}
            placeholder="New Folder"
            className="text-base px-2 py-1 rounded outline-none bg-(--bg-mid) text-(--text-bg)"
          />
        </div>
      )}

      {filteredFolders.map((item) => {
        const isActive = selectedFolder?.id === item.id;
        const Icon = isActive ? FolderOpen : FolderIcon;

        return (
          <div
            key={item.id}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer transition ${isActive
                ? "text-(--isActive-bg) bg-(--bg-Active)"
                : "text-(--text-bg)"
              }`}
          >
            <div
              onClick={() => {
                if (activeView === "trash") return;
                setSelectedFolder({ id: item.id, name: item.name });
                setActiveView(null);
                setSelectedNoteId(null);
                navigate(`/folder/${item.id}`);
              }}
              className="flex items-center gap-3 w-full"
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-(--isActive-bg)" : "text-(--text-bg)"
                  }`}
              />
              <p
                className={`text-base font-semibold ${isActive ? "text-(--isActive-bg)" : "text-(--text-bg)"
                  }`}
              >
                {item.name}
              </p>
            </div>

            {activeView !== "trash" && isActive && (
              <TrashIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(item.id);
                }}
                className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
              />
            )}

            {activeView === "trash" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestoreFolder(item.id);
                }}
                className="text-xs px-2 py-1 bg-(--submit-bg) text-white rounded"
              >
                Restore
              </button>
            )}
          </div>
        );
      })}

      {filteredFolders.length === 0 && (
        <p className="text-(--text-bg) text-sm px-3">
          {activeView === "trash" ? "No deleted folders" : "No folders"}
        </p>
      )}
    </div>
  );
};

export default Folder;