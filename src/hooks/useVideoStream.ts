import { useEffect, useState } from "react";

// eslint-disable-next-line no-undef
function useVideoStream(videoConstraints: boolean | MediaTrackConstraints = true, autoRetry = true) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoStreamError, setVideoStreamError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getVideoStream = async () => {
      if (!isMounted) {
        console.log(
          "이미 언마운트 되었기 때문에 실행안합니다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        if (isMounted) {
          setVideoStream(stream);
          setVideoStreamError(null);
          stream.getTracks().forEach((track) =>
            track.addEventListener("ended", () => {
              getVideoStream();
            })
          );
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
          if (autoRetry) {
            setTimeout(() => {
              getVideoStream();
            }, 1000);
          }
        }
      }
    };

    videoConstraints && getVideoStream();

    return () => {
      isMounted = false;
    };
  }, [videoConstraints, autoRetry]);

  useEffect(() => {
    console.log("videoStream", videoStream);
    return () => videoStream?.getTracks().forEach((track) => track.stop());
  }, [videoStream]);

  return { videoStream, videoStreamError };
}

export default useVideoStream;
