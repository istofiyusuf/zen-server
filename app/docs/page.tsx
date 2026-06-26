"use client";

import PageLayout from "@/components/layout/page-layout";
import { FiBook, FiDatabase, FiGlobe, FiSettings, FiTerminal } from "react-icons/fi";

const docs = [
  {
    icon: FiTerminal,
    title: "Getting Started",
    content: "Install Termux from F-Droid, clone the repository, run npm install && npm run build && npm start.",
  },
  {
    icon: FiGlobe,
    title: "Website Manager",
    content: "Create and manage virtual hosts with PHP, Node.js, Python, or static HTML support.",
  },
  {
    icon: FiDatabase,
    title: "Database Manager",
    content: "Manage SQLite, MariaDB, and PostgreSQL databases. Create, backup, and restore easily.",
  },
  {
    icon: FiSettings,
    title: "Configuration",
    content: "All settings are stored in .env file. Edit port, JWT secret, database URL, and more.",
  },
];

export default function DocsPage() {
  return (
    <PageLayout title="Documentation">
      <div className="p-4 space-y-4">
        {docs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.title} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-medium text-primary">{doc.title}</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed">{doc.content}</p>
            </div>
          );
        })}

        <div className="card text-center py-6">
          <FiBook className="h-8 w-8 text-secondary mx-auto mb-3" />
          <p className="text-sm text-secondary">
            Full documentation available on GitHub
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
