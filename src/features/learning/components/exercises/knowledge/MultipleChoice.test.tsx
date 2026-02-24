import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { MultipleChoice } from "./MultipleChoice";

vi.mock("../../../utils/sounds", () => ({
  sounds: { playTap: vi.fn(), playCorrect: vi.fn(), playIncorrect: vi.fn(), playCelebration: vi.fn() },
}));

const mockData = {
  question: "Which brewing method uses 9 bars of pressure?",
  options: [
    { id: "a", text: "French Press" },
    { id: "b", text: "Espresso" },
    { id: "c", text: "Pour-over" },
    { id: "d", text: "Cold Brew" },
  ],
  correct_answer: "b",
};

describe("MultipleChoice", () => {
  it("renders the question text", () => {
    render(<MultipleChoice data={mockData} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText("Which brewing method uses 9 bars of pressure?")).toBeInTheDocument();
  });

  it("renders all option texts", () => {
    render(<MultipleChoice data={mockData} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText("French Press")).toBeInTheDocument();
    expect(screen.getByText("Espresso")).toBeInTheDocument();
    expect(screen.getByText("Pour-over")).toBeInTheDocument();
    expect(screen.getByText("Cold Brew")).toBeInTheDocument();
  });

  it("check button starts disabled", () => {
    render(<MultipleChoice data={mockData} onSubmit={vi.fn()} disabled={false} />);
    const checkBtn = screen.getByText("Check");
    expect(checkBtn.closest("button")).toBeDisabled();
  });

  it("submitting correct answer calls onSubmit with (answerId, true)", () => {
    const onSubmit = vi.fn();
    render(<MultipleChoice data={mockData} onSubmit={onSubmit} disabled={false} />);
    // Select correct option
    fireEvent.click(screen.getByText("Espresso"));
    // Click check
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith("b", true);
  });

  it("submitting incorrect answer calls onSubmit with (answerId, false)", () => {
    const onSubmit = vi.fn();
    render(<MultipleChoice data={mockData} onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByText("Cold Brew"));
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith("d", false);
  });
});
