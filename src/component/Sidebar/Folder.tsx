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
  } = useApp();

  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const safeFolders = Array.isArray(folders) ? folders : [];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        const data = res?.data?.folders ?? res?.data ?? [];
        const foldersArray = Array.isArray(data) ? data : [];

        const normalized = foldersArray.map((f) => ({
          id: String(f.id),
          name: f.name,
        }));

        setFolders(normalized);

        if (normalized.length > 0 && !selectedFolder) {
          setSelectedFolder(normalized[0]);
        }
      } catch (err) {
        console.error(err);
        setFolders([]);
      }
    };

    fetchFolders();
  }, []);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await apiCreateFolder(newFolderName);
      const rawFolder = res?.data?.folder || res?.data;

      const newFolder = {
        id: String(rawFolder?.id ?? Date.now()),
        name: rawFolder?.name ?? newFolderName,
      };

      setFolders((prev) => [newFolder, ...(prev || [])]);

      setSelectedFolder({
        id: newFolder.id,
        name: newFolder.name,
      });

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
      setFolders((prev) => prev.filter((f) => String(f.id) !== String(id)));
      setSelectedFolder(null);
      setSelectedNoteId(null);
      setRefreshNotes((prev) => !prev);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-80 h-64 pl-3 pr-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-3 sticky top-0 bg-(--sidebar-bg) z-10">
        <p className="text-(--text-bg) text-sm font-semibold pl-3">Folders</p>
        <FolderPlus
          onClick={() => setShowInput(true)}
          className="w-5 h-5 cursor-pointer text-(--text-bg) hover:text-(--plus-hover) transition"
        />
      </div>

      {showInput && (
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

      {safeFolders.map((item) => {
        const isActive = String(selectedFolder?.id) === String(item.id);
        const Icon = isActive ? FolderOpen : FolderIcon;

        return (
          <div
            key={item.id}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer transition ${
              isActive
                ? "text-(--isActive-bg) bg-(--bg-Active)"
                : "text-(--text-bg)"
            }`}
          >
            <div
              onClick={() => {
                setSelectedFolder({
                  id: String(item.id),
                  name: item.name,
                });
                setActiveView(null);
                setSelectedNoteId(null);
                navigate(`/folder/${item.id}`);
              }}
              className="flex items-center gap-3 w-full"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-(--isActive-bg)"
                    : "text-(--text-bg)"
                }`}
              />
              <p
                className={`text-base font-semibold ${
                  isActive
                    ? "text-(--isActive-bg)"
                    : "text-(--text-bg)"
                }`}
              >
                {item.name}
              </p>
            </div>

            {isActive && (
              <TrashIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(item.id);
                }}
                className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
              />
            )}
          </div>
        );
      })}

      {safeFolders.length === 0 && (
        <p className="text-(--text-bg) text-sm px-3">
          No folders
        </p>
      )}
    </div>
  );
};

export default Folder;