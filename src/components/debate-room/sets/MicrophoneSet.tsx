import { ChangeEvent } from "react";

import { CheckButton, Option, Select, Switch } from "@/components";
import { useDeviceActions, useDeviceStore } from "@stores";

function MicrophoneSet() {
  const isMicOn = useDeviceStore((store) => store.isMicOn);
  const micError = useDeviceStore((store) => store.micError);
  const mics = useDeviceStore((store) => store.mics);
  const selectedMicId = useDeviceStore((store) => store.selectedMicId);
  const threshold = useDeviceStore((store) => store.threshold);
  const volume = useDeviceStore((store) => store.volume);
  const isNoiseSuppressionOn = useDeviceStore((store) => store.isNoiseSuppressionOn);
  const { toggleMic, setSelectedMicId, setThreshold, toggleNoiseSuppression } = useDeviceActions();

  const handleMicToggle = () => {
    toggleMic();
  };

  const handleMicChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedMicId(e.target.value);
  };

  const handleChangeThreshold = (e: ChangeEvent<HTMLInputElement>) => {
    setThreshold(Number(e.target.value));
  };

  const handleNoiseSuppressionToggle = () => {
    toggleNoiseSuppression();
  };

  const errorMessage = () => {
    switch (micError?.name) {
      case "NotFoundError":
        return micError.message;
      case "OverconstrainedError":
        return micError.message;
      case "NotAllowedError":
        if (micError.message === "Permission denied") {
          return micError.message;
        } else if (micError.message === "Permission denied by system") {
          return micError.message;
        } else {
          return micError.message;
        }
      case "NotReadableError":
        return micError.message;
      default:
        return `${micError?.name}: ${micError?.message}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">마이크</p>
        <Switch checked={isMicOn} onChange={handleMicToggle} />
      </div>
      <Select
        size="2xs"
        value={selectedMicId}
        onChange={handleMicChange}
        className="mt-[4px] w-full text-start"
        error={!!micError}
        disabled={mics.length === 0}
      >
        {mics.length === 0 && <Option value="" label="마이크를 사용할 수 없습니다." disabled />}
        {mics.map((mic) => (
          <Option key={mic.deviceId} value={mic.deviceId} label={mic.label} />
        ))}
      </Select>
      {!!micError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">{errorMessage()}</p>}

      <div className="slider mt-[4px]">
        <input type="range" min="0" max="255" value={volume} readOnly />
        <input
          type="range"
          min="0"
          max="255"
          step="5"
          value={threshold}
          onChange={handleChangeThreshold}
          className="cursor-pointer"
        />
      </div>
      <div className="text-right">
        <CheckButton
          size="2xs"
          checked={isNoiseSuppressionOn}
          onChange={handleNoiseSuppressionToggle}
          disabled={!isMicOn}
          label="주변 소음 억제"
        />
      </div>
    </div>
  );
}

export default MicrophoneSet;
