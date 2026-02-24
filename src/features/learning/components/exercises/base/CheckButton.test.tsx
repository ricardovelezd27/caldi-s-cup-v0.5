import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { CheckButton } from "./CheckButton";

describe("CheckButton", () => {
  it("renders Check text in disabled state", () => {
    render(<CheckButton state="disabled" onClick={vi.fn()} />);
    expect(screen.getByText("Check")).toBeInTheDocument();
  });

  it("button is disabled when state is disabled", () => {
    render(<CheckButton state="disabled" onClick={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("button is clickable when state is ready", () => {
    const onClick = vi.fn();
    render(<CheckButton state="ready" onClick={onClick} />);
    const btn = screen.getByRole("button");
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders Continue text in correct state", () => {
    render(<CheckButton state="correct" onClick={vi.fn()} />);
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("renders Continue text in incorrect state", () => {
    render(<CheckButton state="incorrect" onClick={vi.fn()} />);
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });
});
