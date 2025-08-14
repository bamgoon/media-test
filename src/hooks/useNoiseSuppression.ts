import { useEffect, useState } from "react";

function useNoiseSuppression(audioStream: MediaStream | null, isActive: boolean) {
  const [noiseSuppressedStream, setNoiseSuppressedStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive || !audioStream) {
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

      setNoiseSuppressedStream(destinationNode.stream);
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
  }, [audioStream, isActive]);

  return isActive ? noiseSuppressedStream : audioStream;
}

export default useNoiseSuppression;
