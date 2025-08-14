import { useTranslation } from "react-i18next";

import { ChangeEvent } from "react";

import { CheckButton, Option, Select, Switch } from "@/components";
import { useDeviceActions, useDeviceStore } from "@stores";

function MicrophoneSet() {
  const { t } = useTranslation();

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
        return t("mic_not_found");
      case "OverconstrainedError":
        return t("mic_unavailable");
      case "NotAllowedError":
        if (micError.message === "Permission denied") {
          return t("mic_browser_perm_denied");
        } else if (micError.message === "Permission denied by system") {
          return t("mic_system_perm_denied");
        } else {
          return t("mic_perm_denied");
        }
      case "NotReadableError":
        return t("mic_in_use");
      default:
        return `${micError?.name}: ${micError?.message}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">{t("microphone")}</p>
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
        {mics.length === 0 && <Option value="" label={t("mic_cannot_use")} disabled />}
        {mics.map((mic) => (
          <Option key={mic.deviceId} value={mic.deviceId} label={mic.label} />
        ))}
      </Select>
      {!!micError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">{errorMessage()}</p>}

      <div className="slider mt-[4px]">
        <input type="range" min="0" max="255" value={volume} readOnly />
        <input type="range" min="0" max="255" step="5" value={threshold} onChange={handleChangeThreshold} className="cursor-pointer" />
      </div>
      <div className="text-right">
        <CheckButton
          size="2xs"
          checked={isNoiseSuppressionOn}
          onChange={handleNoiseSuppressionToggle}
          disabled={!isMicOn}
          label={t("noise_suppression")}
        />
      </div>
    </div>
  );
}

export default MicrophoneSet;
