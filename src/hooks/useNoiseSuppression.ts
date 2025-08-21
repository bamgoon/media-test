import { useEffect, useState } from "react";

declare global {
  interface Window {
    RNNoiseNode: {
      register(context: AudioContext): Promise<void>;
      new (context: AudioContext): AudioWorkletNode;
    };
  }
}

interface UseNoiseSuppressionOptions {
  enabled: boolean;
  audioStream: MediaStream | null;
}

export default function useNoiseSuppression({ enabled, audioStream }: UseNoiseSuppressionOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled || !audioStream) {
      return;
    }

    let audioContext: AudioContext;
    let sourceNode: MediaStreamAudioSourceNode;
    let destinationNode: MediaStreamAudioDestinationNode;
    let rnnoiseNode: AudioWorkletNode;

    const init = async () => {
      audioContext = new AudioContext({ sampleRate: 48000 });
      sourceNode = audioContext.createMediaStreamSource(audioStream);
      destinationNode = audioContext.createMediaStreamDestination();

      await window.RNNoiseNode.register(audioContext);
      rnnoiseNode = new window.RNNoiseNode(audioContext);
      sourceNode.connect(rnnoiseNode);
      rnnoiseNode.connect(destinationNode);

      setStream(destinationNode.stream);
    };

    init();

    return () => {
      if (rnnoiseNode) {
        rnnoiseNode.disconnect();
      }
      if (sourceNode) {
        sourceNode.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [enabled, audioStream]);

  return { stream: enabled ? stream : audioStream };
}
