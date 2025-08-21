import { useEffect, useMemo, useRef } from "react";

import {
  useCombinedStream,
  useNoiseSuppression,
  useSegmenter,
  useSpeechDetection,
  useStream,
  useMediaStore,
} from "@hooks";
import { useDeviceActions, useDeviceStore } from "@stores";
import { CameraSet, MicrophoneSet, SpeakerSet, VirtualBgSet } from "@components";
import { VirtualBg } from "@enums";
import { blue, house, office } from "@assets/images";

const defaultVideoConstraints = {
  frameRate: { ideal: 30, max: 30 },
  width: { min: 320, ideal: 320, max: 320 },
  height: { min: 240, ideal: 240, max: 240 },
};

const defaultAudioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

function DeviceTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { cams, mics, spks, camPermission, micPermission, requestPermission } = useMediaStore();

  const isCamOn = useDeviceStore((store) => store.isCamOn);
  const isMicOn = useDeviceStore((store) => store.isMicOn);
  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);
  const selectedCamId = useDeviceStore((store) => store.selectedCamId);
  const selectedMicId = useDeviceStore((store) => store.selectedMicId);
  const threshold = useDeviceStore((store) => store.threshold);
  const isNoiseSuppressionOn = useDeviceStore((store) => store.isNoiseSuppressionOn);
  const isVirtualBgOn = useDeviceStore((store) => store.isVirtualBgOn);
  const selectedVirtualBg = useDeviceStore((store) => store.selectedVirtualBg);
  const { setCams, setMics, setSpeakers, setCamError, setMicError, setVolume } = useDeviceActions();

  useEffect(() => {
    setCams(cams);
  }, [cams, setCams]);

  useEffect(() => {
    setMics(mics);
  }, [mics, setMics]);

  useEffect(() => {
    setSpeakers(spks);
  }, [spks, setSpeakers]);

  // 미디어 장치 권한 요청
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 비디오 제약 조건
  const videoConstraints = useMemo(() => {
    return {
      video: {
        deviceId: selectedCamId ? { exact: selectedCamId } : undefined,
        ...defaultVideoConstraints,
      },
    };
  }, [selectedCamId]);

  // 비디오 스트림
  const { stream: videoStream, error: videoStreamError } = useStream({
    enabled: isCamOn && (camPermission === "granted" || camPermission === "denied"),
    constraints: videoConstraints,
    retryOnTrackEnded: true,
    maxRetryCount: Infinity,
  });
  useEffect(() => setCamError(videoStreamError), [videoStreamError, setCamError]);

  // 오디오 제약 조건
  const audioConstraints = useMemo(() => {
    return {
      audio: {
        deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
        ...defaultAudioConstraints,
      },
    };
  }, [selectedMicId]);

  // 오디오 스트림
  const { stream: audioStream, error: audioStreamError } = useStream({
    enabled: isMicOn && (micPermission === "granted" || micPermission === "denied"),
    constraints: audioConstraints,
    retryOnTrackEnded: true,
    maxRetryCount: Infinity,
  });
  useEffect(() => setMicError(audioStreamError), [audioStreamError, setMicError]);

  // 가상 배경 스트림
  const { stream: virtualStream } = useSegmenter(
    useMemo(
      () => ({
        videoStream,
        enable: isVirtualBgOn,
        mode: selectedVirtualBg === VirtualBg.Blur ? "blur" : "image",
        backgroundSrc: (() => {
          if (selectedVirtualBg === VirtualBg.Blur) return undefined;
          if (selectedVirtualBg === VirtualBg.Blue) return blue;
          if (selectedVirtualBg === VirtualBg.House) return house;
          if (selectedVirtualBg === VirtualBg.Office) return office;
          return undefined;
        })(),
        blurIntensity: 2,
      }),
      [videoStream, isVirtualBgOn, selectedVirtualBg]
    )
  );

  // 소음 억제 스트림
  const suppressedStream = useNoiseSuppression(audioStream, isNoiseSuppressionOn);

  // 최종 스트림 설정
  const { stream: finalStream } = useCombinedStream(
    useMemo(
      () => ({
        inputStreams: [virtualStream, suppressedStream],
      }),
      [virtualStream, suppressedStream]
    )
  );

  const { isTalk, volume } = useSpeechDetection(suppressedStream, threshold);

  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  useEffect(() => {
    if (videoRef.current && finalStream && finalStream.active) {
      videoRef.current.srcObject = finalStream;
    }
  }, [finalStream]);

  return (
    <div className="align-center-center h-screen flex-col">
      <div className="mt-[20px] flex">
        <video
          ref={videoRef}
          autoPlay
          className={`h-[522px] w-[696px] rounded border-[4px] object-cover
            ${isTalk ? "border-primary-500" : "border-grey-400"}`}
          muted={!isSpeakerOn}
        />
        <div className="ml-[30px] flex w-[260px] flex-col gap-[16px]">
          <CameraSet />
          <MicrophoneSet />
          <SpeakerSet />
          <VirtualBgSet />
        </div>
      </div>
    </div>
  );
}

export default DeviceTestPage;
