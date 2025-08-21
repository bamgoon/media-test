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
    let isMounted = true;

    let audioContext: AudioContext;
    let sourceNode: MediaStreamAudioSourceNode;
    let destinationNode: MediaStreamAudioDestinationNode;
    let rnnoiseNode: AudioWorkletNode;

    const getStream = async () => {
      if (!audioStream) return;
      audioContext = new AudioContext({ sampleRate: 48000 });
      sourceNode = audioContext.createMediaStreamSource(audioStream);
      destinationNode = audioContext.createMediaStreamDestination();

      await window.RNNoiseNode.register(audioContext);
      if (isMounted) {
        rnnoiseNode = new window.RNNoiseNode(audioContext);
        sourceNode.connect(rnnoiseNode);
        rnnoiseNode.connect(destinationNode);

        setStream(destinationNode.stream);
      } else {
        // 언마운트 시 즉시 노드 해제
        rnnoiseNode.disconnect();
        destinationNode.disconnect();
        sourceNode.disconnect();
        audioContext.close();
      }
    };

    // 활성화 상태라면 스트림 가져오기
    if (enabled) {
      getStream();
    }
    // 비활성화 상태라면 스트림 초기화
    else {
      setStream(null);
    }

    return () => {
      isMounted = false;
      rnnoiseNode?.disconnect();
      destinationNode?.disconnect();
      sourceNode?.disconnect();
      audioContext?.close();
    };
  }, [enabled, audioStream]);

  useEffect(() => {
    return () => {
      stream?.getAudioTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return { stream: enabled ? stream : audioStream };
}
