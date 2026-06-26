"use client";

import PageLayout from "@/components/layout/page-layout";
import { packageApi } from "@/services/package-api";
import { useEffect, useState } from "react";
import {
  FiCheck,
  FiDownload,
  FiPackage,
  FiSearch,
  FiTrash2
} from "react-icons/fi";

interface Package {
  name: string;
  version: string;
  status: string;
  description?: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Package[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await packageApi.getInstalled();
      setPackages(data.data.packages);
    } catch (error) {
      console.error("Failed to load packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const data = await packageApi.search(query);
      setSearchResults(data.data.packages);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleInstall = async (name: string) => {
    setInstalling(name);
    try {
      await packageApi.install(name);
      loadPackages();
      setSearchResults([]);
      setSearchQuery("");
      setShowSearch(false);
    } catch (error) {
      console.error("Install error:", error);
    } finally {
      setInstalling(null);
    }
  };

  const handleRemove = async (name: string) => {
    if (!confirm(`Remove "${name}"?`)) return;
    try {
      await packageApi.remove(name);
      loadPackages();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  return (
    <PageLayout
      title="Packages"
      headerRight={
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
        >
          <FiSearch className="h-5 w-5 text-secondary" />
        </button>
      }
    >
      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search packages..."
              autoFocus
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
              {searchResults.map((pkg) => (
                <div
                  key={pkg.name}
                  className="flex items-center justify-between rounded-xl bg-card p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">{pkg.name}</p>
                    <p className="text-xs text-secondary">
                      {pkg.description || pkg.version}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInstall(pkg.name)}
                    disabled={installing === pkg.name}
                    className="btn btn-sm btn-primary"
                  >
                    {installing === pkg.name ? (
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiDownload className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Package List */}
      <div className="p-4 space-y-2">
        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="card flex-1 text-center py-3">
            <p className="text-2xl font-semibold text-primary">{packages.length}</p>
            <p className="text-xs text-secondary">Installed</p>
          </div>
          <div className="card flex-1 text-center py-3">
            <p className="text-2xl font-semibold text-accent">20</p>
            <p className="text-xs text-secondary">Available</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="card text-center py-12">
            <FiPackage className="h-12 w-12 text-secondary mx-auto mb-4" />
            <p className="text-sm text-secondary">No packages installed</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.name}
              className="card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    pkg.status === "installed"
                      ? "bg-success/10"
                      : "bg-warning/10"
                  }`}
                >
                  <FiPackage
                    className={`h-5 w-5 ${
                      pkg.status === "installed"
                        ? "text-success"
                        : "text-warning"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {pkg.name}
                  </p>
                  <p className="text-xs text-secondary">
                    v{pkg.version}
                    {pkg.description ? ` - ${pkg.description}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pkg.status === "installed" ? (
                  <span className="badge badge-success flex items-center gap-1">
                    <FiCheck className="h-3 w-3" />
                    Installed
                  </span>
                ) : (
                  <button
                    onClick={() => handleInstall(pkg.name)}
                    className="btn btn-sm btn-primary"
                  >
                    Install
                  </button>
                )}
                <button
                  onClick={() => handleRemove(pkg.name)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-error/10"
                >
                  <FiTrash2 className="h-4 w-4 text-error" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
