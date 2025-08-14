import { useEffect, useRef, useState } from "react";

import { Select, Switch } from "@components";
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
      <Select value={selectedSpeakerId} disabled>
        {speakers.length === 0 && (
          <option
            value=""
            label={speakerError ? "스피커를 사용할 수 없습니다." : "스피커를 사용할 수 없습니다."}
            disabled
          />
        )}
        {speakers.map((speaker) => (
          <option key={speaker.deviceId} value={speaker.deviceId} label={speaker.label} disabled />
        ))}
      </Select>
      {!!speakerError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">스피커를 사용할 수 없습니다.</p>}

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
