import { useEffect, useState } from "react";

function useVideoStream(videoConstraints: boolean | MediaTrackConstraints = true, autoRetry = false) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoStreamError, setVideoStreamError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        if (isMounted) {
          stream.getTracks().forEach((track) =>
            // getUserMedia()로 가져온 미디어 스트림의 트랙에서 ended 이벤트가 발생하는 건 예외 상황
            // 따라서 ended 이벤트 발생 시, 에러를 확인하기 위해 1회 재시도
            track.addEventListener("ended", getVideoStream, { once: true })
          );
          setVideoStream(stream);
          setVideoStreamError(null);
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setVideoStream(null);
          if (e instanceof DOMException) {
            setVideoStreamError(e);
          } else {
            setVideoStreamError(new Error("Unknown error occurred"));
          }

          // 1초 간격으로 재시도해서 에러 해결 시도
          if (autoRetry) setTimeout(getVideoStream, 1000);
        }
      }
    };

    isMounted && videoConstraints && getVideoStream();

    return () => {
      isMounted = false;
    };
  }, [videoConstraints, autoRetry]);

  useEffect(() => {
    return () => videoStream?.getTracks().forEach((track) => track.stop());
  }, [videoStream]);

  return { videoStream, videoStreamError };
}

export default useVideoStream;
