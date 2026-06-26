"use client";

import PageLayout from "@/components/layout/page-layout";
import { fileApi } from "@/services/file-api";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCode,
  FiFile,
  FiFileText,
  FiFolder,
  FiImage,
  FiPlus,
  FiTrash2
} from "react-icons/fi";

interface FileItem {
  name: string;
  path: string;
  type: "directory" | "file";
  size: number;
  sizeFormatted: string;
  modified: string;
  permissions: string;
  isDirectory: boolean;
  extension: string;
}

export default function FilesPage() {
  const [currentPath, setCurrentPath] = useState("./");
  const [parentPath, setParentPath] = useState<string | null>(null);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (dirPath: string) => {
    setLoading(true);
    try {
      const data = await fileApi.list(dirPath);
      setItems(data.data.items);
      setParentPath(data.data.parentPath);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: FileItem) => {
    if (item.isDirectory) {
      setCurrentPath(item.path);
    } else {
      handlePreview(item);
    }
  };

  const handlePreview = async (item: FileItem) => {
    const textExtensions = [
      ".txt", ".md", ".json", ".js", ".ts", ".jsx", ".tsx",
      ".html", ".css", ".php", ".py", ".env", ".gitignore",
      ".xml", ".yml", ".yaml", ".toml", ".ini", ".cfg", ".conf",
    ];

    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"];

    if (textExtensions.includes(item.extension)) {
      try {
        const data = await fileApi.readFile(item.path);
        setPreviewFile(data.data);
      } catch (error) {
        console.error("Preview error:", error);
      }
    } else {
      setPreviewFile({
        name: item.name,
        sizeFormatted: item.sizeFormatted,
        content: `Cannot preview ${item.extension} files`,
      });
    }
  };

  const handleDelete = async (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await fileApi.delete(item.path);
      loadFiles(currentPath);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await fileApi.createFolder(currentPath, newFolderName.trim());
      setNewFolderName("");
      setShowCreate(false);
      loadFiles(currentPath);
    } catch (error) {
      console.error("Create folder error:", error);
    }
  };

  const getFileIcon = (item: FileItem) => {
    if (item.isDirectory) return FiFolder;

    const ext = item.extension;
    if ([".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"].includes(ext))
      return FiImage;
    if ([".js", ".ts", ".jsx", ".tsx", ".json", ".php", ".py", ".html", ".css"].includes(ext))
      return FiCode;
    if ([".txt", ".md", ".env", ".gitignore"].includes(ext))
      return FiFileText;

    return FiFile;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageLayout
      title="File Manager"
      headerRight={
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
          >
            <FiPlus className="h-5 w-5 text-secondary" />
          </button>
        </div>
      }
    >
      {/* Breadcrumb */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-secondary overflow-x-auto">
          {parentPath !== null && (
            <button
              onClick={() => setCurrentPath(parentPath || "./")}
              className="flex items-center gap-1 text-accent hover:underline shrink-0"
            >
              <FiArrowLeft className="h-3 w-3" />
              Back
            </button>
          )}
          <span className="shrink-0">/</span>
          <span className="text-primary truncate">
            {currentPath === "./" ? "Home" : currentPath}
          </span>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm card">
            <h3 className="text-sm font-medium text-primary mb-3">New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input mb-3"
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div className="flex gap-2">
              <button onClick={handleCreateFolder} className="btn btn-primary flex-1">
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewFolderName("");
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="card text-center py-12">
            <FiFolder className="h-12 w-12 text-secondary mx-auto mb-4" />
            <p className="text-sm text-secondary">Empty folder</p>
          </div>
        ) : (
          items.map((item) => {
            const Icon = getFileIcon(item);
            return (
              <div
                key={item.path}
                onClick={() => handleItemClick(item)}
                className="card flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all hover:bg-card-hover"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.isDirectory ? "bg-accent/10" : "bg-card-hover"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      item.isDirectory ? "text-accent" : "text-secondary"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-secondary">
                    {item.sizeFormatted} - {formatDate(item.modified)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(item, e)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-error/10 shrink-0"
                >
                  <FiTrash2 className="h-4 w-4 text-error" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-primary">
                {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-sm text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>
            <pre className="text-xs text-secondary bg-card-hover rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
              {previewFile.content}
            </pre>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
