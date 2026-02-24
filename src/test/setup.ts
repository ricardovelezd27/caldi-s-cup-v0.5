import "@testing-library/jest-dom";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock AudioContext for sounds.ts
class MockOscillator {
  frequency = { value: 0 };
  type: OscillatorType = "sine";
  connect() { return this; }
  start() {}
  stop() {}
}

class MockGainNode {
  gain = { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} };
  connect() { return this; }
}

class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator() { return new MockOscillator(); }
  createGain() { return new MockGainNode(); }
}

(globalThis as any).AudioContext = MockAudioContext;
