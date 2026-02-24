import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { Calculation } from "./Calculation";

vi.mock("../../../utils/sounds", () => ({
  sounds: { playTap: vi.fn(), playCorrect: vi.fn(), playIncorrect: vi.fn(), playCelebration: vi.fn() },
}));

const mockData = {
  question: "22g coffee at 1:16 ratio. How many ml of water?",
  correct_answer: 352,
  tolerance: 2,
  unit: "ml",
};

describe("Calculation", () => {
  it("renders the question", () => {
    render(<Calculation data={mockData} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText("22g coffee at 1:16 ratio. How many ml of water?")).toBeInTheDocument();
  });

  it("typing correct answer and checking calls onSubmit with correct=true", () => {
    const onSubmit = vi.fn();
    render(<Calculation data={mockData} onSubmit={onSubmit} disabled={false} />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "352" } });
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith(352, true);
  });

  it("answer within tolerance calls onSubmit with correct=true", () => {
    const onSubmit = vi.fn();
    render(<Calculation data={mockData} onSubmit={onSubmit} disabled={false} />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "354" } });
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith(354, true);
  });

  it("answer outside tolerance calls onSubmit with correct=false", () => {
    const onSubmit = vi.fn();
    render(<Calculation data={mockData} onSubmit={onSubmit} disabled={false} />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "400" } });
    fireEvent.click(screen.getByText("Check"));
    expect(onSubmit).toHaveBeenCalledWith(400, false);
  });
});
