"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

type ToolCallStatus = "pending" | "success" | "error";

function getFileName(path: string | undefined): string | undefined {
  if (!path) return undefined;
  return path.split("/").pop() || path;
}

function isStrReplaceEditorError(result: unknown): boolean {
  return typeof result === "string" && result.startsWith("Error:");
}

function isFileManagerSuccess(result: unknown): boolean | undefined {
  if (typeof result === "object" && result !== null && "success" in result) {
    return (result as { success: boolean }).success;
  }
  return undefined;
}

export function getToolCallLabel(
  toolInvocation: ToolInvocation
): { label: string; status: ToolCallStatus } {
  const { toolName, args, state } = toolInvocation;
  const isResult = state === "result";
  const command = args?.command as string | undefined;
  const file = getFileName(args?.path);

  if (toolName === "str_replace_editor") {
    const failed = isResult && isStrReplaceEditorError((toolInvocation as any).result);

    if (!command || !file) {
      return { label: "Working...", status: "pending" };
    }

    switch (command) {
      case "view":
        if (!isResult) return { label: `Viewing ${file}`, status: "pending" };
        return failed
          ? { label: `Failed to view ${file}`, status: "error" }
          : { label: `Viewed ${file}`, status: "success" };
      case "create":
        if (!isResult) return { label: `Creating ${file}`, status: "pending" };
        return failed
          ? { label: `Failed to create ${file}`, status: "error" }
          : { label: `Created ${file}`, status: "success" };
      case "str_replace":
      case "insert":
        if (!isResult) return { label: `Editing ${file}`, status: "pending" };
        return failed
          ? { label: `Failed to edit ${file}`, status: "error" }
          : { label: `Edited ${file}`, status: "success" };
      case "undo_edit":
        if (!isResult) return { label: `Undoing edit to ${file}`, status: "pending" };
        return failed
          ? { label: `Failed to undo edit to ${file}`, status: "error" }
          : { label: `Undid edit to ${file}`, status: "success" };
      default:
        return {
          label: toolName,
          status: isResult ? "success" : "pending",
        };
    }
  }

  if (toolName === "file_manager") {
    if (!command || !file) {
      return { label: "Working...", status: "pending" };
    }

    switch (command) {
      case "rename": {
        const newFile = getFileName(args?.new_path);
        if (!isResult) {
          return newFile
            ? { label: `Renaming ${file} to ${newFile}`, status: "pending" }
            : { label: `Renaming ${file}`, status: "pending" };
        }
        const success = isFileManagerSuccess((toolInvocation as any).result);
        return success
          ? { label: `Renamed ${file} to ${newFile}`, status: "success" }
          : { label: `Failed to rename ${file} to ${newFile}`, status: "error" };
      }
      case "delete": {
        if (!isResult) return { label: `Deleting ${file}`, status: "pending" };
        const success = isFileManagerSuccess((toolInvocation as any).result);
        return success
          ? { label: `Deleted ${file}`, status: "success" }
          : { label: `Failed to delete ${file}`, status: "error" };
      }
      default:
        return {
          label: toolName,
          status: isResult ? "success" : "pending",
        };
    }
  }

  return {
    label: toolName,
    status: isResult ? "success" : "pending",
  };
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { label, status } = getToolCallLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {status === "pending" ? (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      ) : (
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === "success" ? "bg-emerald-500" : "bg-red-500"
          )}
        />
      )}
      <span className={cn(status === "error" ? "text-red-700" : "text-neutral-700")}>
        {label}
      </span>
    </div>
  );
}
