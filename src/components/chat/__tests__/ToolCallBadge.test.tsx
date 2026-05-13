import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- pure label logic ---

test("getToolCallLabel: create loading", () => {
  expect(getToolCallLabel("str_replace_editor", "create", "/App.jsx", false)).toBe("Creating /App.jsx");
});

test("getToolCallLabel: create done", () => {
  expect(getToolCallLabel("str_replace_editor", "create", "/App.jsx", true)).toBe("Created /App.jsx");
});

test("getToolCallLabel: str_replace loading", () => {
  expect(getToolCallLabel("str_replace_editor", "str_replace", "/components/Card.jsx", false)).toBe("Editing /components/Card.jsx");
});

test("getToolCallLabel: str_replace done", () => {
  expect(getToolCallLabel("str_replace_editor", "str_replace", "/components/Card.jsx", true)).toBe("Edited /components/Card.jsx");
});

test("getToolCallLabel: insert loading", () => {
  expect(getToolCallLabel("str_replace_editor", "insert", "/components/Card.jsx", false)).toBe("Editing /components/Card.jsx");
});

test("getToolCallLabel: view loading", () => {
  expect(getToolCallLabel("str_replace_editor", "view", "/App.jsx", false)).toBe("Reading /App.jsx");
});

test("getToolCallLabel: view done", () => {
  expect(getToolCallLabel("str_replace_editor", "view", "/App.jsx", true)).toBe("Read /App.jsx");
});

test("getToolCallLabel: undo_edit loading", () => {
  expect(getToolCallLabel("str_replace_editor", "undo_edit", "/App.jsx", false)).toBe("Reverting /App.jsx");
});

test("getToolCallLabel: undo_edit done", () => {
  expect(getToolCallLabel("str_replace_editor", "undo_edit", "/App.jsx", true)).toBe("Reverted /App.jsx");
});

test("getToolCallLabel: unknown command loading", () => {
  expect(getToolCallLabel("str_replace_editor", "unknown", "/App.jsx", false)).toBe("Working on /App.jsx");
});

test("getToolCallLabel: unknown command done", () => {
  expect(getToolCallLabel("str_replace_editor", "unknown", "/App.jsx", true)).toBe("Updated /App.jsx");
});

test("getToolCallLabel: missing path falls back to tool name", () => {
  expect(getToolCallLabel("str_replace_editor", "create", undefined, false)).toBe("Creating str_replace_editor");
});

test("getToolCallLabel: file_manager rename loading", () => {
  expect(getToolCallLabel("file_manager", "rename", "/old.jsx", false)).toBe("Renaming /old.jsx");
});

test("getToolCallLabel: file_manager rename done", () => {
  expect(getToolCallLabel("file_manager", "rename", "/old.jsx", true)).toBe("Renamed /old.jsx");
});

test("getToolCallLabel: file_manager delete loading", () => {
  expect(getToolCallLabel("file_manager", "delete", "/App.jsx", false)).toBe("Deleting /App.jsx");
});

test("getToolCallLabel: file_manager delete done", () => {
  expect(getToolCallLabel("file_manager", "delete", "/App.jsx", true)).toBe("Deleted /App.jsx");
});

// --- component rendering ---

test("ToolCallBadge shows spinner and loading label while in progress", () => {
  render(
    <ToolCallBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
  // spinner is present (lucide renders an svg)
  const svg = document.querySelector("svg");
  expect(svg).toBeDefined();
  // no green dot
  const dot = document.querySelector(".bg-emerald-500");
  expect(dot).toBeNull();
});

test("ToolCallBadge shows green dot and done label when result received", () => {
  render(
    <ToolCallBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );

  expect(screen.getByText("Created /App.jsx")).toBeDefined();
  const dot = document.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
});

test("ToolCallBadge renders for str_replace command", () => {
  render(
    <ToolCallBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        result: "ok",
        args: { command: "str_replace", path: "/components/Card.jsx" },
      }}
    />
  );

  expect(screen.getByText("Edited /components/Card.jsx")).toBeDefined();
});

test("ToolCallBadge renders for file_manager delete", () => {
  render(
    <ToolCallBadge
      toolInvocation={{
        toolName: "file_manager",
        state: "result",
        result: "ok",
        args: { command: "delete", path: "/old.jsx" },
      }}
    />
  );

  expect(screen.getByText("Deleted /old.jsx")).toBeDefined();
});

test("ToolCallBadge does not crash when path is missing", () => {
  render(
    <ToolCallBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create" },
      }}
    />
  );

  expect(screen.getByText("Creating str_replace_editor")).toBeDefined();
});
