import { useEffect, useState } from "react";

// eslint-disable-next-line no-undef
function useAudioStream(audioConstraints: boolean | MediaTrackConstraints = true) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioStreamError, setAudioStreamError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getAudioStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        if (isMounted) {
          setAudioStream(stream);
          setAudioStreamError(null);
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setAudioStream(null);
          if (e instanceof Error) {
            setAudioStreamError(e);
          } else {
            setAudioStreamError(new Error("Unknown error occurred"));
          }
        }
      }
    };

    audioConstraints && getAudioStream();

    return () => {
      isMounted = false;
    };
  }, [audioConstraints]);

  useEffect(() => {
    return () => audioStream?.getTracks().forEach((track) => track.stop());
  }, [audioStream]);

  return { audioStream, audioStreamError };
}

export default useAudioStream;
