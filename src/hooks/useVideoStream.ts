import { useEffect, useState } from "react";

// eslint-disable-next-line no-undef
function useVideoStream(videoConstraints: boolean | MediaTrackConstraints = true) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoStreamError, setVideoStreamError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        if (isMounted) {
          setVideoStream(stream);
          setVideoStreamError(null);
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setVideoStream(null);
          if (e instanceof Error) {
            setVideoStreamError(e);
          } else {
            setVideoStreamError(new Error("Unknown error occurred"));
          }
        }
      }
    };

    videoConstraints && getVideoStream();

    return () => {
      isMounted = false;
    };
  }, [videoConstraints]);

  useEffect(() => {
    return () => videoStream?.getTracks().forEach((track) => track.stop());
  }, [videoStream]);

  return { videoStream, videoStreamError };
}

export default useVideoStream;
