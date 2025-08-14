import { useEffect, useMemo, useRef } from "react";

import {
  useAudioStream,
  useCombinedStream,
  useMediaDevices,
  useNoiseSuppression,
  useRequestPermission,
  useSegmentation,
  useSpeechDetection,
  useVideoStream,
} from "@hooks";
import { useDeviceActions, useDeviceStore } from "@stores";
import { CameraSet, MicrophoneSet, SpeakerSet, VirtualBgSet } from "@components";

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

const requestConstraints = {
  video: defaultVideoConstraints,
  audio: defaultAudioConstraints,
};

function DeviceTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isCamOn = useDeviceStore((store) => store.isCamOn);
  const isMicOn = useDeviceStore((store) => store.isMicOn);
  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);
  const selectedCamId = useDeviceStore((store) => store.selectedCamId);
  const selectedMicId = useDeviceStore((store) => store.selectedMicId);
  const threshold = useDeviceStore((store) => store.threshold);
  const isNoiseSuppressionOn = useDeviceStore((store) => store.isNoiseSuppressionOn);
  const isVirtualBgOn = useDeviceStore((store) => store.isVirtualBgOn);
  const selectedVirtualBg = useDeviceStore((store) => store.selectedVirtualBg);
  const { setCams, setMics, setSpeakers, setCamError, setMicError, setSpeakerError, setVolume } = useDeviceActions();

  // 장치 목록 설정
  const { cameras, microphones, speakers } = useMediaDevices();

  useEffect(() => {
    setCams(cameras);
  }, [cameras, setCams]);

  useEffect(() => {
    setMics(microphones);
  }, [microphones, setMics]);

  useEffect(() => {
    setSpeakers(speakers);
  }, [speakers, setSpeakers]);

  // 미디어 장치 권한 요청
  useRequestPermission(requestConstraints);

  // 비디오 스트림
  const { videoStream, videoStreamError } = useVideoStream(
    useMemo(
      () => ({ deviceId: { exact: selectedCamId ? selectedCamId : undefined }, ...defaultVideoConstraints }),
      [selectedCamId]
    )
  );
  useEffect(() => setCamError(videoStreamError), [videoStreamError, setCamError]);

  // 오디오 스트림
  const { audioStream, audioStreamError } = useAudioStream(
    useMemo(
      () => ({ deviceId: { exact: selectedMicId ? selectedMicId : undefined }, ...defaultAudioConstraints }),
      [selectedMicId]
    )
  );
  useEffect(() => setMicError(audioStreamError), [audioStreamError, setMicError]);

  // 스피커 에러 처리
  useEffect(() => {
    // 마이크 권한이 있는데도 스피커 목록이 없는 경우엔 NotFoundError 발생
    if (audioStreamError?.name !== "NotAllowedError" && speakers.length === 0) {
      setSpeakerError({ name: "NotFoundError", message: "Requested device not found" });
    } else {
      setSpeakerError(null);
    }
  }, [audioStreamError, speakers, setSpeakerError]);

  // 가상 배경 스트림
  const virtualStream = useSegmentation(videoStream, isVirtualBgOn, selectedVirtualBg);

  // 소음 억제 스트림
  const suppressedStream = useNoiseSuppression(audioStream, isNoiseSuppressionOn);

  // 최종 스트림 설정
  const stream = useCombinedStream(useMemo(() => [virtualStream, suppressedStream], [virtualStream, suppressedStream]));

  const { isTalk, volume } = useSpeechDetection(suppressedStream, threshold);

  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  useEffect(() => {
    suppressedStream?.getAudioTracks().forEach((track) => (track.enabled = isMicOn));
  }, [suppressedStream, isMicOn]);

  useEffect(() => {
    stream?.getAudioTracks().forEach((track) => (track.enabled = isTalk));
  }, [stream, isTalk]);

  useEffect(() => {
    stream?.getVideoTracks().forEach((track) => (track.enabled = isCamOn));
  }, [stream, isCamOn]);

  useEffect(() => {
    if (videoRef.current && stream && stream.active) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
