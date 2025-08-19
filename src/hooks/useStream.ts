import { useEffect, useRef, useState } from "react";

interface UseStreamOptions {
  enabled: boolean;
  constraints: MediaStreamConstraints;
  retryDelayMs?: number;
  maxRetryCount?: number;
  retryOnTrackEnded?: boolean;
}

export default function useStream({
  enabled,
  constraints,
  retryDelayMs = 1000,
  maxRetryCount = 0,
  retryOnTrackEnded = false,
}: UseStreamOptions) {
  const retryOnTrackEndedRef = useRef(retryOnTrackEnded);
  const retryDelayMsRef = useRef(retryDelayMs);
  const maxRetryCountRef = useRef(maxRetryCount);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    retryOnTrackEndedRef.current = retryOnTrackEnded;
    retryDelayMsRef.current = retryDelayMs;
    maxRetryCountRef.current = maxRetryCount;
  }, [retryOnTrackEnded, retryDelayMs, maxRetryCount]);

  useEffect(() => {
    let isMounted = true;
    let currentStream: MediaStream | null = null;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    const abortController = new AbortController();

    const getStream = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isMounted) {
          if (retryOnTrackEndedRef.current) {
            // getUserMedia()로 가져온 미디어 스트림의 트랙에서 ended 이벤트가 발생하는 건 예외 상황
            // 따라서 ended 이벤트 발생 시, 에러를 해결하기 위해 재시도
            let hasHandled = false;

            currentStream.getTracks().forEach((track) => {
              track.addEventListener(
                "ended",
                () => {
                  // 이미 재시도했거나 언마운트된 경우 무시
                  if (hasHandled || !isMounted) return;

                  // 재시도
                  hasHandled = true;
                  getStream();
                },
                { signal: abortController.signal, once: true }
              );
            });
          }
          setStream(currentStream);
          setError(null);

          // 재시도 카운트 초기화
          retryCount = 0;
        } else {
          // 언마운트 시 즉시 스트림 정리
          currentStream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setStream(null);
          setError(e as Error);

          // 실패 시 재시도해서 에러 해결 시도
          retryCount++;
          if (retryCount < maxRetryCountRef.current) {
            retryTimeout = setTimeout(getStream, retryDelayMsRef.current);
          }
        }
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
      abortController.abort();
      clearTimeout(retryTimeout);
    };
  }, [enabled, constraints]);

  // 스트림 변경 시 이전 스트림 정리
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return { stream, error };
}
