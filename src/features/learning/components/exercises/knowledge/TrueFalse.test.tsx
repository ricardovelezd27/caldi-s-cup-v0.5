import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { TrueFalse } from "./TrueFalse";

vi.mock("../../../utils/sounds", () => ({
  sounds: { playTap: vi.fn(), playCorrect: vi.fn(), playIncorrect: vi.fn(), playCelebration: vi.fn() },
}));

const mockData = {
  statement: "Robusta coffee has more caffeine than Arabica.",
  correct_answer: true,
};

describe("TrueFalse", () => {
  it("renders the statement text", () => {
    render(<TrueFalse data={mockData} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText("Robusta coffee has more caffeine than Arabica.")).toBeInTheDocument();
  });

  it("renders True and False buttons", () => {
    render(<TrueFalse data={mockData} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText("True")).toBeInTheDocument();
    expect(screen.getByText("False")).toBeInTheDocument();
  });

  it("selecting True and checking calls onSubmit with (true, true)", () => {
    const onSubmit = vi.fn();
    render(<TrueFalse data={mockData} onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByText("True"));
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith(true, true);
  });
});
