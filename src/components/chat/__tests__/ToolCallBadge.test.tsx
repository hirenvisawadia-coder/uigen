import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

// str_replace_editor: view
test("view command while pending", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Viewing App.jsx");
  expect(result.status).toBe("pending");
});

test("view command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "1: const App = () => {}",
  } as ToolInvocation);

  expect(result.label).toBe("Viewed App.jsx");
  expect(result.status).toBe("success");
});

test("view command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "Error: file not found",
  } as ToolInvocation);

  expect(result.label).toBe("Failed to view App.jsx");
  expect(result.status).toBe("error");
});

// str_replace_editor: create
test("create command while pending, nested path", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Card.jsx" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Creating Card.jsx");
  expect(result.status).toBe("pending");
});

test("create command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Card.jsx" },
    state: "result",
    result: "File created",
  } as ToolInvocation);

  expect(result.label).toBe("Created Card.jsx");
  expect(result.status).toBe("success");
});

test("create command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Card.jsx" },
    state: "result",
    result: "Error: could not create file",
  } as ToolInvocation);

  expect(result.label).toBe("Failed to create Card.jsx");
  expect(result.status).toBe("error");
});

// str_replace_editor: str_replace
test("str_replace command while pending", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx", old_str: "a", new_str: "b" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Editing App.jsx");
  expect(result.status).toBe("pending");
});

test("str_replace command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx", old_str: "a", new_str: "b" },
    state: "result",
    result: "Replaced",
  } as ToolInvocation);

  expect(result.label).toBe("Edited App.jsx");
  expect(result.status).toBe("success");
});

test("str_replace command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx", old_str: "a", new_str: "b" },
    state: "result",
    result: "Error: old_str not found",
  } as ToolInvocation);

  expect(result.label).toBe("Failed to edit App.jsx");
  expect(result.status).toBe("error");
});

// str_replace_editor: insert
test("insert command while pending", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/App.jsx", insert_line: 1, new_str: "x" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Editing App.jsx");
  expect(result.status).toBe("pending");
});

test("insert command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/App.jsx", insert_line: 1, new_str: "x" },
    state: "result",
    result: "Inserted",
  } as ToolInvocation);

  expect(result.label).toBe("Edited App.jsx");
  expect(result.status).toBe("success");
});

test("insert command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/App.jsx", insert_line: 1, new_str: "x" },
    state: "result",
    result: "Error: invalid insert_line",
  } as ToolInvocation);

  expect(result.label).toBe("Failed to edit App.jsx");
  expect(result.status).toBe("error");
});

// str_replace_editor: undo_edit
test("undo_edit command while pending", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/App.jsx" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Undoing edit to App.jsx");
  expect(result.status).toBe("pending");
});

test("undo_edit command always resolves as failure today", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/App.jsx" },
    state: "result",
    result: "Error: undo_edit command is not supported in this version. Use str_replace to revert changes.",
  } as ToolInvocation);

  expect(result.label).toBe("Failed to undo edit to App.jsx");
  expect(result.status).toBe("error");
});

// file_manager: rename
test("rename command while pending with new_path known", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.js", new_path: "/new.js" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Renaming old.js to new.js");
  expect(result.status).toBe("pending");
});

test("rename command while pending with new_path not yet streamed", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.js" },
    state: "partial-call",
  } as ToolInvocation);

  expect(result.label).toBe("Renaming old.js");
  expect(result.status).toBe("pending");
});

test("rename command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.js", new_path: "/new.js" },
    state: "result",
    result: { success: true, message: "Successfully renamed /old.js to /new.js" },
  } as ToolInvocation);

  expect(result.label).toBe("Renamed old.js to new.js");
  expect(result.status).toBe("success");
});

test("rename command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.js", new_path: "/new.js" },
    state: "result",
    result: { success: false, error: "Failed to rename /old.js to /new.js" },
  } as ToolInvocation);

  expect(result.label).toBe("Failed to rename old.js to new.js");
  expect(result.status).toBe("error");
});

// file_manager: delete
test("delete command while pending", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/old.js" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("Deleting old.js");
  expect(result.status).toBe("pending");
});

test("delete command on success", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/old.js" },
    state: "result",
    result: { success: true, message: "Successfully deleted /old.js" },
  } as ToolInvocation);

  expect(result.label).toBe("Deleted old.js");
  expect(result.status).toBe("success");
});

test("delete command on failure", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/old.js" },
    state: "result",
    result: { success: false, error: "Failed to delete /old.js" },
  } as ToolInvocation);

  expect(result.label).toBe("Failed to delete old.js");
  expect(result.status).toBe("error");
});

// Edge cases
test("partial-call with no args yet falls back to Working...", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: {},
    state: "partial-call",
  } as ToolInvocation);

  expect(result.label).toBe("Working...");
  expect(result.status).toBe("pending");
});

test("partial-call with command but no path yet falls back to Working...", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create" },
    state: "partial-call",
  } as ToolInvocation);

  expect(result.label).toBe("Working...");
  expect(result.status).toBe("pending");
});

test("unrecognized tool name while pending falls back to raw tool name", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "custom_future_tool",
    args: { foo: "bar" },
    state: "call",
  } as unknown as ToolInvocation);

  expect(result.label).toBe("custom_future_tool");
  expect(result.status).toBe("pending");
});

test("unrecognized tool name on result falls back to raw tool name", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "custom_future_tool",
    args: { foo: "bar" },
    state: "result",
    result: "done",
  } as unknown as ToolInvocation);

  expect(result.label).toBe("custom_future_tool");
  expect(result.status).toBe("success");
});

test("known tool name with unrecognized command falls back to raw tool name", () => {
  const result = getToolCallLabel({
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "rewrite", path: "/App.jsx" },
    state: "call",
  } as ToolInvocation);

  expect(result.label).toBe("str_replace_editor");
  expect(result.status).toBe("pending");
});

// Rendering / visual wiring
test("renders pending state with spinner and no dot", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "call",
      } as ToolInvocation}
    />
  );

  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
  expect(container.querySelector(".bg-red-500")).toBeNull();
});

test("renders success state with green dot and no spinner", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "result",
        result: "File created",
      } as ToolInvocation}
    />
  );

  expect(screen.getByText("Created Card.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("renders error state with red dot and red text", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "result",
        result: "Error: could not create file",
      } as ToolInvocation}
    />
  );

  const label = screen.getByText("Failed to create Card.jsx");
  expect(label).toBeDefined();
  expect(label.className).toContain("text-red-700");
  expect(container.querySelector(".bg-red-500")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
