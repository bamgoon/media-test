import { ChangeEvent } from "react";

import { Select, Switch } from "@components";
import { useDeviceActions, useDeviceStore } from "@stores";
import { useMediaStore } from "@hooks";

function CameraSet() {
  const { camPermission, requestCamPermission } = useMediaStore();
  const isCamOn = useDeviceStore((store) => store.isCamOn);
  const camError = useDeviceStore((store) => store.camError);
  const cams = useDeviceStore((store) => store.cams);
  const selectedCamId = useDeviceStore((store) => store.selectedCamId);
  const { toggleCam, setSelectedCamId } = useDeviceActions();

  const handleCamToggle = () => {
    toggleCam();
  };

  const handleCamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamId(e.target.value);
  };

  const errorMessage = () => {
    switch (camError?.name) {
      case "NotFoundError":
        return camError.message;
      case "OverconstrainedError":
        return camError.message;
      case "NotAllowedError":
        if (camError.message === "Permission denied") {
          return camError.message;
        } else if (camError.message === "Permission denied by system") {
          return camError.message;
        } else {
          return camError.message;
        }
      case "NotReadableError":
        return camError.message;
      default:
        return `${camError?.name}: ${camError?.message}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">카메라</p>
        <Switch checked={isCamOn} onChange={handleCamToggle} />
      </div>
      {camPermission === "prompt" && cams.length > 0 ? (
        <button
          onClick={requestCamPermission}
          className="text-primary-500 rounded border border-grey-400 bg-white py-[6px] pl-[10px] pr-[30px] typo-2xs600 mt-[4px] w-full "
        >
          카메라 권한 요청
        </button>
      ) : (
        <Select
          value={selectedCamId}
          onChange={handleCamChange}
          disabled={cams.length === 0 || camPermission !== "granted"}
        >
          {cams.length === 0 && <option label="카메라 장치를 찾을 수 없습니다." disabled />}
          {camPermission !== "granted" && <option label="카메라 권한이 필요합니다." disabled />}
          {cams.map((cam) => (
            <option key={cam.deviceId} value={cam.deviceId} label={cam.label} />
          ))}
        </Select>
      )}
      {!!camError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">{errorMessage()}</p>}
    </div>
  );
}

export default CameraSet;
