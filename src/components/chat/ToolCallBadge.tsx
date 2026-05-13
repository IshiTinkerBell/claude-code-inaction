"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  result?: unknown;
  args: { command?: string; path?: string; [key: string]: unknown };
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function getToolCallLabel(
  toolName: string,
  command: string | undefined,
  path: string | undefined,
  isDone: boolean
): string {
  const file = path ?? toolName;

  if (toolName === "file_manager") {
    if (command === "rename") return isDone ? `Renamed ${file}` : `Renaming ${file}`;
    if (command === "delete") return isDone ? `Deleted ${file}` : `Deleting ${file}`;
    return isDone ? `Updated ${file}` : `Working on ${file}`;
  }

  switch (command) {
    case "create":    return isDone ? `Created ${file}`   : `Creating ${file}`;
    case "str_replace":
    case "insert":    return isDone ? `Edited ${file}`    : `Editing ${file}`;
    case "view":      return isDone ? `Read ${file}`      : `Reading ${file}`;
    case "undo_edit": return isDone ? `Reverted ${file}`  : `Reverting ${file}`;
    default:          return isDone ? `Updated ${file}`   : `Working on ${file}`;
  }
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { toolName, state, result, args } = toolInvocation;
  const isDone = state === "result" && result !== undefined;
  const label = getToolCallLabel(toolName, args.command, args.path, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
