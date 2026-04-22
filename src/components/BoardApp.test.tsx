import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BoardApp } from "@/components/BoardApp";
import { useBoardStore } from "@/store/useBoardStore";

describe("BoardApp", () => {
  beforeEach(() => {
    useBoardStore.getState().resetApp();
    useBoardStore.getState().registerUser({
      name: "Prince",
      email: "prince@example.com",
      password: "secret123",
    });
    vi.restoreAllMocks();
  });

  it("creates a card from the inline form", async () => {
    const user = userEvent.setup();
    render(<BoardApp />);

    const todoColumn = screen.getByDisplayValue("Todo").closest("section");
    expect(todoColumn).not.toBeNull();

    await user.click(within(todoColumn as HTMLElement).getByRole("button", { name: "Add card" }));
    await user.type(screen.getByLabelText("Card title"), "Draft release notes");
    await user.type(screen.getByLabelText("Card details"), "Keep the copy brief.");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Draft release notes")).toBeInTheDocument();
  });

  it("renames a column inline", async () => {
    const user = userEvent.setup();
    render(<BoardApp />);

    const input = screen.getByLabelText("Review column title");
    await user.clear(input);
    await user.type(input, "QA");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByDisplayValue("QA")).toBeInTheDocument();
    });
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<BoardApp />);

    await user.click(screen.getByRole("button", { name: "Delete Audit empty states" }));

    expect(screen.queryByText("Audit empty states")).not.toBeInTheDocument();
  });

  it("updates a card inline", async () => {
    const user = userEvent.setup();
    render(<BoardApp />);

    await user.click(screen.getByRole("button", { name: "Edit Map drag edge cases" }));
    await user.clear(screen.getByLabelText("Edit title for Map drag edge cases"));
    await user.type(screen.getByLabelText("Edit title for Map drag edge cases"), "Audit hydration issues");
    await user.clear(screen.getByLabelText("Edit details for Map drag edge cases"));
    await user.type(screen.getByLabelText("Edit details for Map drag edge cases"), "Check client-only rendering.");
    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(screen.getByText("Audit hydration issues")).toBeInTheDocument();
    expect(screen.getByText("Check client-only rendering.")).toBeInTheDocument();
  });

  it("shows an AI status update and inserts mocked tasks", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: "The board is moving, but review work is thin and done is still light on shipped polish.",
        tasks: ["Set up store tests", "Finalize drag polish", "Add AI route coverage"],
      }),
    } as Response);

    render(<BoardApp />);

    await user.selectOptions(screen.getByLabelText("Insert Into"), "done");
    await user.type(screen.getByLabelText("Prompt"), "Plan the remaining board work.");
    await user.click(screen.getByRole("button", { name: "Ask AI" }));

    await waitFor(() => {
      expect(screen.getByText(/review work is thin/i)).toBeInTheDocument();
      expect(screen.getAllByText("Set up store tests")).toHaveLength(2);
      expect(screen.getAllByText("Finalize drag polish")).toHaveLength(2);
      expect(screen.getAllByText("Add AI route coverage")).toHaveLength(2);
    });
  });

  it("records completed tasks in history and lets users delete them", async () => {
    const user = userEvent.setup();
    render(<BoardApp />);

    await user.click(screen.getByRole("button", { name: "Delete history for Choose color system" }));

    expect(
      screen.queryByRole("button", { name: "Delete history for Choose color system" }),
    ).not.toBeInTheDocument();
  });
});
