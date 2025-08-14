import { useEffect, useRef, useState } from "react";

import { Select, Switch } from "@components";
import { test } from "@assets/sounds";
import { useDeviceActions, useDeviceStore } from "@stores";

function SpeakerSet() {
  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);
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
      <Select value="">
        <option value="" label="기본값 - 시스템 기본 스피커" />
      </Select>

      <button
        className="typo-2xs600 px-[30px] py-[6px] mt-[4px] w-full rounded px bg-primary-500 text-white hover:bg-primary-600 disabled:bg-grey-400"
        onClick={handleTestSpeaker}
        disabled={!isSpeakerOn || isPlaying}
      >
        스피커 테스트
      </button>
    </div>
  );
}

export default SpeakerSet;
