import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

interface UseSegmenterOptions {
  enable: boolean;
  videoStream: MediaStream | null;
  blurIntensity?: number;
}

export default function useSegmenter({ enable, videoStream, blurIntensity = 4 }: UseSegmenterOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const imageSegmenterRef = useRef<ImageSegmenter | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm"
        );
        const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            delegate: "GPU",
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
          },
          runningMode: "VIDEO",
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        });
        imageSegmenterRef.current = imageSegmenter;
      } catch (error) {
        console.error(error);
        setError(error as Error);
      }
    };
    initialize();

    videoRef.current = document.createElement("video");
    canvasRef.current = document.createElement("canvas");
    bgCanvasRef.current = document.createElement("canvas");
    const canvasStream = canvasRef.current.captureStream();
    setStream(canvasStream);

    return () => {
      if (imageSegmenterRef.current) {
        imageSegmenterRef.current.close();
        imageSegmenterRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.remove();
        videoRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
      if (bgCanvasRef.current) {
        bgCanvasRef.current.remove();
        bgCanvasRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = videoStream;
    video.oncanplay = () => {
      video.play();
    };
  }, [videoStream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  useEffect(() => {
    if (!enable) return;

    const intervalId = setInterval(() => {
      const imageSegmenter = imageSegmenterRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasCtx = canvas?.getContext("2d");
      const bgCanvas = bgCanvasRef.current;
      const bgCanvasCtx = bgCanvas?.getContext("2d");

      // 하나라도 준비되지 않았다면 리턴
      if (!imageSegmenter || !video || !canvas || !bgCanvas || !canvasCtx || !bgCanvasCtx) return;

      // 비디오 준비 안됐으면 리턴
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      // 세그멘테이션 마스크 데이터 가져오기
      imageSegmenter.segmentForVideo(video, performance.now(), (result) => {
        // 세그멘테이션 마스크가 없으면 리턴
        if (!result.confidenceMasks) return;

        // 비디오 크기 가져오기
        const width = video.videoWidth;
        const height = video.videoHeight;

        // 캔버스 크기 설정
        canvas.width = width;
        canvas.height = height;
        bgCanvas.width = width;
        bgCanvas.height = height;

        // 원본 이미지를 최종 캔버스에 그리기
        canvasCtx.drawImage(video, 0, 0, width, height);
        const canvasImageData = canvasCtx.getImageData(0, 0, width, height);
        const canvasData = canvasImageData.data;

        // 블러 처리한 이미지를 배경 캔버스에 그리기
        bgCanvasCtx.filter = `blur(${blurIntensity}px)`;
        bgCanvasCtx.drawImage(video, 0, 0, width, height);
        const bgCanvasImageData = bgCanvasCtx.getImageData(0, 0, width, height);
        const bgCanvasData = bgCanvasImageData.data;

        // 세그멘테이션 마스크 데이터를 ImageData로 변환
        const confidenceMaskData = result.confidenceMasks[0].getAsFloat32Array();

        // 마스크 데이터를 기반으로 픽셀 단위로 블렌딩
        for (let i = 0; i < confidenceMaskData.length; i++) {
          const selfieProp = confidenceMaskData[i]; // 셀피 확률
          const bgProp = 1 - selfieProp; // 배경 확률

          // 선형 보간법으로 블렌딩 적용
          // 최종 픽셀 = 원본 픽셀 * 셀피 확률 + 배경 픽셀 * 배경 확률
          canvasData[i * 4 + 0] = canvasData[i * 4 + 0] * selfieProp + bgCanvasData[i * 4 + 0] * bgProp; // R
          canvasData[i * 4 + 1] = canvasData[i * 4 + 1] * selfieProp + bgCanvasData[i * 4 + 1] * bgProp; // G
          canvasData[i * 4 + 2] = canvasData[i * 4 + 2] * selfieProp + bgCanvasData[i * 4 + 2] * bgProp; // B
        }

        // 최종 이미지 데이터를 캔버스에 삽입
        canvasCtx.putImageData(canvasImageData, 0, 0);
      });
    }, 1000 / 30);

    return () => {
      clearInterval(intervalId);
    };
  }, [enable, blurIntensity]);

  return { stream: enable ? stream : videoStream, streamError: error };
}
