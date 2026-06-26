"use client";

import PageLayout from "@/components/layout/page-layout";
import { websiteApi } from "@/services/website-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

export default function CreateWebsitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    domain: "",
    port: "8080",
    type: "static",
    phpVersion: "",
    nodeVersion: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.port) {
      setError("Name and port are required");
      return;
    }

    setLoading(true);

    try {
      await websiteApi.create({
        name: form.name,
        domain: form.domain || `${form.name}.local`,
        port: parseInt(form.port),
        type: form.type,
        phpVersion: form.phpVersion || undefined,
        nodeVersion: form.nodeVersion || undefined,
      });
      router.push("/websites");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Create Website"
      headerRight={
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
        >
          <FiArrowLeft className="h-5 w-5 text-secondary" />
        </button>
      }
    >
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm text-secondary mb-2 block">
              Website Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="my-website"
              required
              disabled={loading}
            />
          </div>

          {/* Domain */}
          <div>
            <label className="text-sm text-secondary mb-2 block">
              Domain (optional)
            </label>
            <input
              type="text"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              className="input"
              placeholder="mysite.local"
              disabled={loading}
            />
          </div>

          {/* Port */}
          <div>
            <label className="text-sm text-secondary mb-2 block">
              Port
            </label>
            <input
              type="number"
              value={form.port}
              onChange={(e) => setForm({ ...form, port: e.target.value })}
              className="input"
              placeholder="8080"
              required
              disabled={loading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm text-secondary mb-2 block">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input"
              disabled={loading}
            >
              <option value="static">Static HTML</option>
              <option value="php">PHP</option>
              <option value="nodejs">Node.js</option>
              <option value="python">Python</option>
            </select>
          </div>

          {/* PHP Version (if PHP selected) */}
          {form.type === "php" && (
            <div>
              <label className="text-sm text-secondary mb-2 block">
                PHP Version
              </label>
              <select
                value={form.phpVersion}
                onChange={(e) =>
                  setForm({ ...form, phpVersion: e.target.value })
                }
                className="input"
                disabled={loading}
              >
                <option value="">Default</option>
                <option value="8.2">PHP 8.2</option>
                <option value="8.1">PHP 8.1</option>
                <option value="7.4">PHP 7.4</option>
              </select>
            </div>
          )}

          {/* Node Version (if Node.js selected) */}
          {form.type === "nodejs" && (
            <div>
              <label className="text-sm text-secondary mb-2 block">
                Node.js Version
              </label>
              <select
                value={form.nodeVersion}
                onChange={(e) =>
                  setForm({ ...form, nodeVersion: e.target.value })
                }
                className="input"
                disabled={loading}
              >
                <option value="">Default</option>
                <option value="20">Node.js 20</option>
                <option value="18">Node.js 18</option>
                <option value="16">Node.js 16</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiPlus className="h-4 w-4" />
                Create Website
              </span>
            )}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
