import { useContext, useEffect, useRef } from "react";

import { cn } from "@/utils";
import { CameraSet, MicrophoneSet, SpeakerSet, VirtualBgSet } from "@components";
import { StreamContext } from "@contexts";
import { useDeviceStore } from "@stores";

type DeviceTestPage2Props = {
  isTalk: boolean;
};

function DeviceTestPage2({ isTalk }: DeviceTestPage2Props) {
  const stream = useContext(StreamContext);

  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);

  const videoRef = useRef<HTMLVideoElement>(null);

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
          className={cn("h-[522px] w-[696px] rounded border-[4px] object-cover", isTalk && "border-primary-500")}
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

export default DeviceTestPage2;
