import { useEffect } from "react";

const MAX_ATTEMPT = 3;

function useRequestPermission(constraints: MediaStreamConstraints) {
  useEffect(() => {
    const { video, audio } = constraints;
    if (!video && !audio) {
      console.warn("Video or audio request is required.");
      return;
    }

    const requestMedia = async (attempt = 1) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        if (attempt < MAX_ATTEMPT) {
          console.warn(`Retrying getUserMedia (${attempt}):`, error);
          requestMedia(attempt + 1);
        } else {
          console.error("Failed to getUserMedia:", error);
        }
      }
    };

    requestMedia();
  }, [constraints]);
}

export default useRequestPermission;
