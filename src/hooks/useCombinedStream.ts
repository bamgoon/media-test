import { useEffect, useState } from "react";

interface UseCombinedStreamOptions {
  inputStreams: (MediaStream | null)[];
}

export default function useCombinedStream({ inputStreams }: UseCombinedStreamOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (inputStreams.every((inputStream) => inputStream === null)) {
      return;
    }

    const newStream = new MediaStream();

    inputStreams.forEach((inputStream) => {
      if (inputStream) {
        inputStream.getTracks().forEach((track) => {
          newStream.addTrack(track.clone());
        });
      }
    });

    setStream(newStream);

    return () => {
      newStream.getTracks().forEach((track) => {
        track.stop();
        newStream.removeTrack(track);
      });
      setStream(null);
    };
  }, [inputStreams]);

  return { stream };
}
