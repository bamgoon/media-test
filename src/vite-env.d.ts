/// <reference types="vite/client" />

declare global {
  interface Window {
    RNNoiseNode: {
      register(context: AudioContext): Promise<void>;
      new (context: AudioContext): AudioWorkletNode;
    };
  }
}

export {};
