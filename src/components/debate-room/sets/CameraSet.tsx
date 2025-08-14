import { useTranslation } from "react-i18next";

import { ChangeEvent } from "react";

import { Option, Select, Switch } from "@/components";
import { useDeviceActions, useDeviceStore } from "@stores";

function CameraSet() {
  const { t } = useTranslation();

  const isCamOn = useDeviceStore((store) => store.isCamOn);
  const camError = useDeviceStore((store) => store.camError);
  const cams = useDeviceStore((store) => store.cams);
  const selectedCamId = useDeviceStore((store) => store.selectedCamId);
  const { toggleCam, setSelectedCamId } = useDeviceActions();

  const handleCamToggle = () => {
    toggleCam();
  };

  const handleCamChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCamId(e.target.value);
  };

  const errorMessage = () => {
    switch (camError?.name) {
      case "NotFoundError":
        return t("camera_not_found");
      case "OverconstrainedError":
        return t("camera_unavailable");
      case "NotAllowedError":
        if (camError.message === "Permission denied") {
          return t("camera_browser_perm_denied");
        } else if (camError.message === "Permission denied by system") {
          return t("camera_system_perm_denied");
        } else {
          return t("camera_perm_denied");
        }
      case "NotReadableError":
        return t("camera_in_use");
      default:
        return `${camError?.name}: ${camError?.message}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">{t("camera")}</p>
        <Switch checked={isCamOn} onChange={handleCamToggle} />
      </div>
      <Select
        size="2xs"
        value={selectedCamId}
        onChange={handleCamChange}
        className="mt-[4px] w-full text-start"
        error={!!camError}
        disabled={cams.length === 0}
      >
        {cams.length === 0 && <Option value="" label={t("camera_cannot_use")} disabled />}
        {cams.map((cam) => (
          <Option key={cam.deviceId} value={cam.deviceId} label={cam.label} />
        ))}
      </Select>
      {!!camError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">{errorMessage()}</p>}
    </div>
  );
}

export default CameraSet;
