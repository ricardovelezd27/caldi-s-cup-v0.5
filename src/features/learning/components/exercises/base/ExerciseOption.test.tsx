import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { ExerciseOption } from "./ExerciseOption";

// Mock sounds to avoid AudioContext in tests
vi.mock("../../../utils/sounds", () => ({
  sounds: { playTap: vi.fn(), playCorrect: vi.fn(), playIncorrect: vi.fn(), playCelebration: vi.fn() },
}));

describe("ExerciseOption", () => {
  const defaultProps = {
    isSelected: false,
    isCorrect: null as boolean | null,
    isDisabled: false,
    onClick: vi.fn(),
  };

  it("renders children text", () => {
    render(<ExerciseOption {...defaultProps}>Espresso</ExerciseOption>);
    expect(screen.getByText("Espresso")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<ExerciseOption {...defaultProps} onClick={onClick}>Option</ExerciseOption>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when isDisabled=true", () => {
    const onClick = vi.fn();
    render(<ExerciseOption {...defaultProps} isDisabled onClick={onClick}>Option</ExerciseOption>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders letter prefix when letterIndex is provided", () => {
    render(<ExerciseOption {...defaultProps} letterIndex={0}>Option A</ExerciseOption>);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders letter B for letterIndex=1", () => {
    render(<ExerciseOption {...defaultProps} letterIndex={1}>Option B</ExerciseOption>);
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("applies selected styling", () => {
    render(<ExerciseOption {...defaultProps} isSelected>Selected</ExerciseOption>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-secondary");
  });

  it("shows checkmark icon when isCorrect=true", () => {
    render(<ExerciseOption {...defaultProps} isSelected isCorrect={true}>Correct</ExerciseOption>);
    // The Check icon from lucide-react renders as an SVG
    const btn = screen.getByRole("button");
    expect(btn.querySelector("svg")).toBeTruthy();
  });
});
