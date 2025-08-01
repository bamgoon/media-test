import { useCallback, useEffect, useState } from "react";

const DEFAULT_CONSTRAINTS = { video: true, audio: true };
function useMediaPermission(constraints: MediaStreamConstraints = DEFAULT_CONSTRAINTS) {
  const [camPermission, setCamPermission] = useState<PermissionState>();
  const [micPermission, setMicPermission] = useState<PermissionState>();

  // 권한 요청 함수
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error requesting media permissions:", error);
      if (error instanceof DOMException && error.name === "NotAllowedError" && error.message.includes("dismiss")) {
        requestPermission();
      }
    }
  }, [constraints]);

  useEffect(() => {
    let isMounted = true;
    let camPermissionStatus: PermissionStatus | null = null;
    let micPermissionStatus: PermissionStatus | null = null;

    async function checkPermission() {
      [camPermissionStatus, micPermissionStatus] = await Promise.all([
        navigator.permissions.query({ name: "camera" }),
        navigator.permissions.query({ name: "microphone" }),
      ]);

      // 이미 언마운트 되었으면 상태 업데이트 없이 바로 종료
      if (!isMounted) return;

      setCamPermission(camPermissionStatus.state);
      camPermissionStatus.onchange = (e) => {
        console.log("camPermissionStatus.onchange", e);
        setCamPermission((e.target as PermissionStatus).state);
      };
      setMicPermission(micPermissionStatus.state);
      micPermissionStatus.onchange = (e) => {
        setMicPermission((e.target as PermissionStatus).state);
      };
    }

    checkPermission();

    return () => {
      // 언마운트 처리
      isMounted = false;

      if (camPermissionStatus) {
        camPermissionStatus.onchange = null;
        camPermissionStatus = null;
      }
      if (micPermissionStatus) {
        micPermissionStatus.onchange = null;
        micPermissionStatus = null;
      }
    };
  }, []);

  useEffect(() => {
    if (camPermission === undefined || micPermission === undefined) {
      return;
    }

    if (camPermission === "prompt" || micPermission === "prompt") {
      requestPermission();
    }
  }, [camPermission, micPermission, requestPermission]);

  return { camPermission, micPermission, requestPermission };
}

export default useMediaPermission;
