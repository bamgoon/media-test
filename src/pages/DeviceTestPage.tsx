import { useEffect, useMemo, useRef } from "react";

import {
  useAudioStream,
  useCombinedStream,
  useNoiseSuppression,
  useSegmentation,
  useSpeechDetection,
  useVideoStream,
  useMediaStore,
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

  // 비디오 스트림
  const { videoStream, videoStreamError } = useVideoStream(
    useMemo(
      () =>
        camPermission === "granted" || camPermission === "denied"
          ? { deviceId: { exact: selectedCamId }, ...defaultVideoConstraints }
          : false,
      [camPermission, selectedCamId]
    )
  );
  useEffect(() => setCamError(videoStreamError), [videoStreamError, setCamError]);

  // 오디오 스트림
  const { audioStream, audioStreamError } = useAudioStream(
    useMemo(
      () =>
        micPermission === "granted" || micPermission === "denied"
          ? { deviceId: { exact: selectedMicId }, ...defaultAudioConstraints }
          : false,
      [micPermission, selectedMicId]
    )
  );
  useEffect(() => setMicError(audioStreamError), [audioStreamError, setMicError]);

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
