"use client";

import { useToastStore } from "@/lib/toast-store";
import { terminalApi } from "@/services/terminal-api";
import { useEffect, useRef, useState } from "react";
import { FiCopy, FiPlay, FiTerminal, FiTrash2 } from "react-icons/fi";

interface TerminalLine {
  id: string;
  type: "command" | "output" | "error" | "info" | "success";
  content: string;
}

const WELCOME_MESSAGE = `
╔══════════════════════════════════════════╗
║           ZEN SERVER TERMINAL            ║
║              Version 1.0.0               ║
╚══════════════════════════════════════════╝

Type 'help' for available commands.
Type 'clear' to clear screen.
Arrow Up/Down for command history.

`;

export default function TerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: "welcome", type: "info", content: WELCOME_MESSAGE },
  ]);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [executing, setExecuting] = useState(false);
  const [currentCwd, setCurrentCwd] = useState("~");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    inputRef.current?.focus();

    const handleClick = () => inputRef.current?.focus();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (type: TerminalLine["type"], content: string) => {
    const newLine: TerminalLine = {
      id: Math.random().toString(36).substring(2),
      type,
      content,
    };
    setLines((prev) => [...prev, newLine]);
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd || executing) return;

    setHistory((prev) => [trimmedCmd, ...prev.slice(0, 99)]);
    setHistoryIndex(-1);
    addLine("command", `${currentCwd} $ ${trimmedCmd}`);
    setCommand("");
    setExecuting(true);

    // Built-in: clear
    if (trimmedCmd === "clear" || trimmedCmd === "cls") {
      setLines([]);
      setExecuting(false);
      return;
    }

    // Built-in: help
    if (trimmedCmd === "help") {
      addLine("info", `
Available Commands:
  clear/cls    Clear terminal screen
  pwd          Print working directory
  cd <dir>     Change directory
  ls/dir       List files
  echo <text>  Print text
  cat <file>   Read file content
  whoami       Current user
  date         Current date/time
  help         Show this help

Any system command can also be executed.
      `);
      setExecuting(false);
      return;
    }

    // Built-in: cd
    if (trimmedCmd.startsWith("cd ")) {
      const newPath = trimmedCmd.substring(3).trim();
      try {
        const response = await terminalApi.cd(newPath, currentCwd);
        if (response.success) {
          setCurrentCwd(response.data.cwd);
          addLine("success", `Directory changed to: ${response.data.cwd}`);
        } else {
          addLine("error", response.message);
        }
      } catch (err: any) {
        addLine("error", err.message);
      }
      setExecuting(false);
      return;
    }

    // Execute system command
    try {
      const response = await terminalApi.exec(trimmedCmd, currentCwd);

      if (response.success && response.data) {
        if (response.data.output) {
          addLine("output", response.data.output.trimEnd());
        }
        if (response.data.error) {
          addLine("error", response.data.error.trimEnd());
        }
        if (response.data.exitCode !== undefined && response.data.exitCode !== 0) {
          // Command failed but no error message
        }
      } else {
        addLine("error", response.output || "Command failed");
      }
    } catch (err: any) {
      addLine("error", err.message || "Connection error");
    } finally {
      setExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setCommand("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Auto-complete bisa ditambahkan di sini
    }
  };

  const clearTerminal = () => {
    setLines([]);
    addToast("info", "Terminal cleared");
  };

  const copyOutput = () => {
    const text = lines.map((l) => l.content).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      addToast("success", "Copied to clipboard");
    }).catch(() => {
      addToast("error", "Failed to copy");
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="flex h-12 items-center justify-between border-b border-[#1a1a1a] px-4 bg-[#0d0d0d] shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
            <FiTerminal className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm font-medium text-primary">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={copyOutput}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
            title="Copy output"
          >
            <FiCopy className="h-4 w-4 text-secondary" />
          </button>
          <button
            onClick={clearTerminal}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
            title="Clear terminal"
          >
            <FiTrash2 className="h-4 w-4 text-secondary" />
          </button>
        </div>
      </header>

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
        style={{ minHeight: 0 }}
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-0.5 leading-relaxed whitespace-pre-wrap break-all">
            {line.type === "command" && (
              <span className="text-accent">{line.content}</span>
            )}
            {line.type === "output" && (
              <span className="text-[#c0c0c0]">{line.content}</span>
            )}
            {line.type === "error" && (
              <span className="text-error">{line.content}</span>
            )}
            {line.type === "info" && (
              <span className="text-secondary">{line.content}</span>
            )}
            {line.type === "success" && (
              <span className="text-success">{line.content}</span>
            )}
          </div>
        ))}

        {executing && (
          <div className="flex items-center gap-2 text-secondary mt-1">
            <div className="h-3 w-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-xs">Running...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#1a1a1a] bg-[#0d0d0d] p-3 shrink-0">
        <div className="flex items-center gap-2 rounded-xl bg-[#111111] border border-[#222222] px-4 py-2 focus-within:border-accent/30 transition-colors">
          <span className="text-accent font-mono text-sm shrink-0 select-none">
            {currentCwd === "~" ? "~" : currentCwd.split("/").pop() || "~"} $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-primary font-mono outline-none placeholder:text-[#444]"
            placeholder="type command..."
            disabled={executing}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <button
            onClick={() => executeCommand(command)}
            disabled={executing || !command.trim()}
            className="shrink-0 p-1 text-accent hover:bg-accent/10 rounded-lg disabled:opacity-30 transition-all"
          >
            <FiPlay className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[10px] text-[#444]">
            Enter: execute | Up/Down: history | Tab: autocomplete
          </p>
          <p className="text-[10px] text-[#444]">
            {currentCwd}
          </p>
        </div>
      </div>
    </div>
  );
}
