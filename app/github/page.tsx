"use client";

import PageLayout from "@/components/layout/page-layout";
import { FiCode, FiExternalLink, FiGitBranch, FiGithub, FiStar } from "react-icons/fi";

export default function GitHubPage() {
  return (
    <PageLayout title="GitHub">
      <div className="p-4 space-y-4">
        <div className="card text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10 mx-auto mb-4">
            <FiGithub className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Zen Server</h2>
          <p className="text-sm text-secondary mb-4">
            Android Web Server Dashboard for Termux
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex items-center gap-1 text-sm text-secondary">
              <FiStar className="h-4 w-4 text-warning" />
              0 Stars
            </span>
            <span className="flex items-center gap-1 text-sm text-secondary">
              <FiGitBranch className="h-4 w-4 text-accent" />
              main
            </span>
            <span className="flex items-center gap-1 text-sm text-secondary">
              <FiCode className="h-4 w-4 text-success" />
              MIT
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <FiExternalLink className="h-4 w-4" />
            Open Repository
          </a>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-primary mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "Express", "Prisma", "SQLite", "TailwindCSS", "Socket.IO", "JWT"].map(
              (tech) => (
                <span key={tech} className="badge badge-info">
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
