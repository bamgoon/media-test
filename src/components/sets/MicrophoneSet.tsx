import { ChangeEvent } from "react";

import { Select, Switch } from "@components";
import { useDeviceActions, useDeviceStore } from "@stores";
import { useMediaStore } from "@hooks";

function MicrophoneSet() {
  const { micPermission, requestMicPermission } = useMediaStore();
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

  const handleMicChange = (e: ChangeEvent<HTMLSelectElement>) => {
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

      {micPermission === "prompt" && mics.length > 0 ? (
        <button
          onClick={requestMicPermission}
          className="text-primary-500 rounded border border-grey-400 bg-white py-[6px] pl-[10px] pr-[30px] typo-2xs600 mt-[4px] w-full "
        >
          마이크 권한 요청
        </button>
      ) : (
        <Select
          value={selectedMicId}
          onChange={handleMicChange}
          disabled={mics.length === 0 || micPermission !== "granted"}
        >
          {mics.length === 0 && <option value="" label="마이크 장치를 찾을 수 없습니다." disabled />}
          {micPermission !== "granted" && <option value="" label="마이크 권한이 필요합니다." disabled />}
          {mics.map((mic) => (
            <option key={mic.deviceId} value={mic.deviceId} label={mic.label} />
          ))}
        </Select>
      )}

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
      <label className="typo-2xs400 flex justify-end items-center gap-[4px]">
        <input
          type="checkbox"
          checked={isNoiseSuppressionOn}
          onChange={handleNoiseSuppressionToggle}
          disabled={!isMicOn}
          className="accent-primary-600 "
        />
        <span>주변 소음 억제</span>
      </label>
    </div>
  );
}

export default MicrophoneSet;
