import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

import { useEffect, useRef } from "react";

import { blue, house, office } from "@assets/images";
import { VirtualBg } from "@enums";

const FRAME_RATE = 30;

function useSegmentation(videoStream: MediaStream | null, isVirtualBgOn: boolean, selectedVirtualBg: VirtualBg) {
  const selfieSegmentation = useRef<SelfieSegmentation | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const canvasStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    const selfieSegmentationRef = selfieSegmentation.current;
    selfieSegmentation.current = new SelfieSegmentation({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.current.setOptions({ modelSelection: 1 });
    selfieSegmentation.current.initialize();

    video.current = document.createElement("video");
    video.current.autoplay = true;
    img.current = document.createElement("img");

    canvas.current = document.createElement("canvas");
    canvasCtx.current = canvas.current.getContext("2d");
    canvasStream.current = canvas.current.captureStream(FRAME_RATE);

    return () => {
      if (selfieSegmentationRef) {
        selfieSegmentationRef.close();
        selfieSegmentation.current = null;
      }

      if (video.current) {
        video.current.remove();
        video.current = null;
      }

      if (img.current) {
        img.current.remove();
        img.current = null;
      }

      if (canvas.current) {
        canvas.current.remove();
        canvas.current = null;
      }

      if (canvasCtx.current) {
        canvasCtx.current = null;
      }

      if (canvasStream.current) {
        canvasStream.current.getTracks().forEach((track) => track.stop());
        canvasStream.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!videoStream || !video.current) {
      return;
    }
    const videoRef = video.current;
    videoRef.srcObject = videoStream;
    return () => {
      videoRef.srcObject = null;
    };
  }, [videoStream]);

  useEffect(() => {
    if (!selfieSegmentation.current || !img.current) {
      return;
    }
    // 가상 배경 설정
    if (selectedVirtualBg === VirtualBg.Blue) {
      img.current.src = blue;
    } else if (selectedVirtualBg === VirtualBg.House) {
      img.current.src = house;
    } else if (selectedVirtualBg === VirtualBg.Office) {
      img.current.src = office;
    }

    // onResults 설정
    selfieSegmentation.current.onResults((results) => {
      if (!canvas.current || !canvasCtx.current || !video.current || !img.current) {
        return;
      }

      // 비디오 크기에 맞게 캔버스 크기 조정
      const width = video.current.videoWidth;
      const height = video.current.videoHeight;
      canvas.current.width = width;
      canvas.current.height = height;

      // 캔버스 초기화
      canvasCtx.current.clearRect(0, 0, width, height);

      // 배경 그리기
      if (selectedVirtualBg === VirtualBg.Blur) {
        canvasCtx.current.filter = "blur(5px)";
        canvasCtx.current.drawImage(results.image, 0, 0, width, height);
      } else {
        canvasCtx.current.drawImage(img.current, 0, 0, width, height);
      }

      // 배경에서 마스크 빼기
      canvasCtx.current.filter = "blur(2px)";
      canvasCtx.current.globalCompositeOperation = "destination-out";
      canvasCtx.current.drawImage(results.segmentationMask, 0, 0, width, height);

      // 빈 곳에 인물 그리기
      canvasCtx.current.filter = "none";
      canvasCtx.current.globalCompositeOperation = "destination-over";
      canvasCtx.current.drawImage(results.image, 0, 0, width, height);
    });
  }, [selectedVirtualBg]);

  useEffect(() => {
    if (!isVirtualBgOn) {
      return;
    }

    const sendFrame = async () => {
      if (!selfieSegmentation.current || !video.current) {
        return;
      }
      // 비디오가 준비 됐으면 이미지 전송
      if (video.current.readyState === video.current.HAVE_ENOUGH_DATA) {
        await selfieSegmentation.current.send({ image: video.current });
      }
    };

    const intervalId = setInterval(sendFrame, 1000 / FRAME_RATE);

    return () => {
      clearInterval(intervalId);
    };
  }, [isVirtualBgOn]);

  return isVirtualBgOn ? canvasStream.current : videoStream;
}

export default useSegmentation;
