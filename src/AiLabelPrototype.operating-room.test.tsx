import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AiLabelPrototype from "./pages/AiLabelPrototype";

const enterLabelHq = () => {
  render(<AiLabelPrototype />);
  fireEvent.click(screen.getByRole("button", { name: /continue to context/i }));
  fireEvent.click(screen.getByRole("button", { name: /enter workspace/i }));
};

beforeEach(() => {
  Object.defineProperty(window, "scrollTo", { configurable: true, value: vi.fn() });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AiLabelPrototype Label HQ operating room", () => {
  it("makes Label HQ the operating room and keeps Manager Office focused on conversation", () => {
    enterLabelHq();

    expect(screen.getByRole("heading", { name: /^label hq$/i })).toBeInTheDocument();
    expect(screen.getByText(/your daily operating picture/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /record label navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^label hq$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^staff$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^missions$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.queryByText(/notifications/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^manager$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^evidence$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^review$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/artist profile/i)).not.toBeInTheDocument();
    expect(screen.getByText(/today's brief/i)).toBeInTheDocument();
    expect(screen.getByText(/momentum is building/i)).toBeInTheDocument();
    expect(screen.getByText(/one thing to do today/i)).toBeInTheDocument();
    expect(screen.getByText(/active missions/i)).toBeInTheDocument();
    expect(screen.getByText(/flagged for you/i)).toBeInTheDocument();
    expect(screen.getByText(/the staff/i)).toBeInTheDocument();
    expect(screen.getByText(/sync & deals/i)).toBeInTheDocument();
    expect(screen.getByText(/finance\/rights/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/view supporting evidence/i).closest("button")!);
    expect(screen.getByText(/evidence file/i)).toBeInTheDocument();
    expect(screen.getByText(/private Spotify saves/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/talk to manager/i).closest("button")!);

    expect(screen.getByText(/manager office/i)).toBeInTheDocument();
    expect(screen.getByText(/manager questions/i)).toBeInTheDocument();
    expect(screen.queryByText(/active missions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/flagged for you/i)).not.toBeInTheDocument();
  }, 10000);

  it("keeps Label HQ sidebar actions wired to durable prototype surfaces", () => {
    enterLabelHq();

    fireEvent.click(screen.getByRole("button", { name: /^missions$/i }));
    expect(screen.getByRole("heading", { name: /^active missions$/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /record label navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^label hq$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^staff$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^missions$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^settings$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(screen.getByRole("heading", { name: /artist profile/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^label hq$/i }));
    fireEvent.click(screen.getByText(/talk to manager/i).closest("button")!);
    expect(screen.getByText(/manager office/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /record label navigation/i })).toBeInTheDocument();
  }, 10000);

  it("opens Staff as a durable sidebar destination and routes agents from there", () => {
    enterLabelHq();

    fireEvent.click(screen.getByRole("button", { name: /^staff$/i }));
    expect(screen.getByRole("heading", { name: /^the staff$/i })).toBeInTheDocument();
    expect(screen.getByText(/your ai department heads, source readiness, and active handoffs/i)).toBeInTheDocument();
    expect(screen.getByText(/^5$/i)).toBeInTheDocument();
    expect(screen.getByText(/^1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^4$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^staff$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ai manager/i }));
    expect(screen.getByText(/manager office/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^staff$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^staff$/i }));
    fireEvent.click(screen.getByRole("button", { name: /marketing lead/i }));
    expect(screen.getAllByRole("heading", { name: /marketing lead/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/unlock requirements/i)).toBeInTheDocument();
    expect(screen.getByText(/content analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/campaign history/i)).toBeInTheDocument();
  }, 10000);

  it("shows compact agent source readiness inside agent rooms", () => {
    enterLabelHq();

    fireEvent.click(screen.getByRole("button", { name: /finance\/rights/i }));
    expect(screen.getByText(/unlock requirements/i)).toBeInTheDocument();
    expect(screen.getByText(/royalty statements/i)).toBeInTheDocument();
    expect(screen.getByText(/split sheets/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload files/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    fireEvent.click(screen.getByRole("button", { name: /sync & deals/i }));
    expect(screen.getByText(/rights clarity/i)).toBeInTheDocument();
    expect(screen.getByText(/pitch assets/i)).toBeInTheDocument();
  });

  it("makes briefs helpful agent-to-agent communication and records mission memory", () => {
    enterLabelHq();
    fireEvent.click(screen.getByRole("button", { name: /validate night bus before scale spend/i }));

    fireEvent.click(screen.getByText(/^briefs$/i).closest("button")!);
    expect(screen.getByText(/Manager -> Marketing Lead/i)).toBeInTheDocument();
    expect(screen.getByText(/Run finding/i)).toBeInTheDocument();
    expect(screen.getByText(/I need a tight 10-day content sprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Source basis:/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended next action:/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Message$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Linked mission$/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    fireEvent.click(screen.getByText(/^record$/i).closest("button")!);
    expect(screen.getByText(/Mission memory/i)).toBeInTheDocument();
    expect(screen.getByText(/This is what the AI reads/i)).toBeInTheDocument();
    expect(screen.getByText(/We approved the structure of a capped validation test/i)).toBeInTheDocument();
    expect(screen.getByText(/Spotify saves are up 72% in the early read/i)).toBeInTheDocument();
    expect(screen.getByText(/The next useful move is not another card or task/i)).toBeInTheDocument();
    expect(screen.getByText(/72-hour read/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Current state$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Evidence used$/i)).not.toBeInTheDocument();
  });

  it("keeps recent conversations as Manager threads after context is ready", () => {
    enterLabelHq();
    fireEvent.click(screen.getByRole("button", { name: /talk to manager/i }));

    while (screen.queryByRole("button", { name: /save answer/i })) {
      fireEvent.click(screen.getByRole("button", { name: /use suggested reply/i }));
      const saveButton = screen.queryByRole("button", { name: /save answer/i });
      if (saveButton) fireEvent.click(saveButton);
    }

    expect(screen.getByText(/recent conversations/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /night bus budget allocation/i }));

    expect(screen.getByText(/conversation thread/i)).toBeInTheDocument();
    expect(screen.getAllByText(/night bus budget allocation/i).length).toBeGreaterThan(0);
  });
});
