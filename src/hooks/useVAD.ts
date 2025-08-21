import { MicVAD } from "@ricky0123/vad-web";
import { useEffect, useState } from "react";

interface UseVADOptions {
  enabled: boolean;
  audioStream: MediaStream | null;
}

export default function useVAD({ enabled, audioStream }: UseVADOptions) {
  const [vad, setVad] = useState<MicVAD | null>(null);
  const [isSpeech, setIsSpeech] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!audioStream) {
      setVad(null);
      return;
    }
    let vad: MicVAD | null = null;
    const initVAD = async () => {
      vad = await MicVAD.new({
        stream: audioStream,
        onSpeechStart: () => setIsSpeech(true),
        onSpeechEnd: () => setIsSpeech(false),
      });
      if (isMounted) {
        setVad(vad);
      } else {
        vad?.destroy();
      }
    };
    initVAD();

    return () => {
      isMounted = false;
      vad?.destroy();
    };
  }, [audioStream]);

  useEffect(() => {
    if (enabled) {
      vad?.start();
    } else {
      vad?.pause();
      setIsSpeech(false);
    }
  }, [vad, enabled]);

  return { isSpeech };
}
