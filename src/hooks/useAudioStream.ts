import { useEffect, useState } from "react";

function useAudioStream(audioConstraints: boolean | MediaTrackConstraints = true, autoRetry = false) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioStreamError, setAudioStreamError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getAudioStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        if (isMounted) {
          stream.getTracks().forEach((track) =>
            // getUserMedia()로 가져온 미디어 스트림의 트랙에서 ended 이벤트가 발생하는 건 예외 상황
            // 따라서 ended 이벤트 발생 시, 에러를 확인하기 위해 1회 재시도
            track.addEventListener("ended", getAudioStream, { once: true })
          );
          setAudioStream(stream);
          setAudioStreamError(null);
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setAudioStream(null);
          if (e instanceof DOMException) {
            setAudioStreamError(e);
          } else {
            setAudioStreamError(new Error("Unknown error occurred"));
          }

          // 1초 간격으로 재시도해서 에러 해결 시도
          if (autoRetry) setTimeout(getAudioStream, 1000);
        }
      }
    };

    isMounted && audioConstraints && getAudioStream();

    return () => {
      isMounted = false;
    };
  }, [audioConstraints, autoRetry]);

  useEffect(() => {
    return () => audioStream?.getTracks().forEach((track) => track.stop());
  }, [audioStream]);

  return { audioStream, audioStreamError };
}

export default useAudioStream;
