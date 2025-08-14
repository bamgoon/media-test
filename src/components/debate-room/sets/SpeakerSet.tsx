import { useEffect, useRef, useState } from "react";

import { Button, Option, Select, Switch } from "@/components";
import { test } from "@assets/sounds";
import { useDeviceActions, useDeviceStore } from "@stores";

function SpeakerSet() {
  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);
  const speakerError = useDeviceStore((store) => store.speakerError);
  const speakers = useDeviceStore((store) => store.speakers);
  const selectedSpeakerId = useDeviceStore((store) => store.selectedSpeakerId);
  const { toggleSpeaker } = useDeviceActions();

  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    testAudioRef.current = new Audio(test);
    testAudioRef.current.preload = "auto";

    const handleEnded = () => setIsPlaying(false);
    testAudioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (testAudioRef.current) {
        testAudioRef.current.removeEventListener("ended", handleEnded);
        testAudioRef.current.pause();
        testAudioRef.current.src = "";
        testAudioRef.current = null;
      }
    };
  }, []);

  const handleSpeakerToggle = () => {
    toggleSpeaker();
  };

  const handleTestSpeaker = () => {
    if (!isPlaying && testAudioRef.current) {
      setIsPlaying(true);
      testAudioRef.current.play().catch((error) => {
        console.error("Test audio play error:", error);
        setIsPlaying(false);
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">스피커</p>
        <Switch checked={isSpeakerOn} onChange={handleSpeakerToggle} />
      </div>
      <Select
        size="2xs"
        value={selectedSpeakerId}
        className="mt-[4px] w-full text-start disabled:bg-white"
        error={!!speakerError}
        disabled
      >
        {speakers.length === 0 && (
          <Option
            value=""
            label={speakerError ? "스피커를 사용할 수 없습니다." : "스피커를 사용할 수 없습니다."}
            disabled
          />
        )}
        {speakers.map((speaker) => (
          <Option key={speaker.deviceId} value={speaker.deviceId} label={speaker.label} disabled />
        ))}
      </Select>
      {!!speakerError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">스피커를 사용할 수 없습니다.</p>}

      <Button
        size="2xs"
        className="typo-2xs600 mt-[4px] w-full"
        onClick={handleTestSpeaker}
        disabled={!isSpeakerOn || isPlaying}
      >
        스피커 테스트
      </Button>
    </div>
  );
}

export default SpeakerSet;
