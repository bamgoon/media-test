import { useTranslation } from "react-i18next";

import { Switch } from "@/components";
import { cn } from "@/utils";
import { VirtualBg } from "@enums";
import { useDeviceActions, useDeviceStore } from "@stores";

const virtualBg = ["blur", "blue", "house", "office"];

function VirtualBgSet() {
  const { t } = useTranslation();

  const isVirtualBgOn = useDeviceStore((store) => store.isVirtualBgOn);
  const selectedVirtualBg = useDeviceStore((store) => store.selectedVirtualBg);
  const camError = useDeviceStore((store) => store.camError);
  const { toggleVirtualBg, setSelectedVirtualBg } = useDeviceActions();

  const handleToggleVirtualBg = () => {
    toggleVirtualBg();
  };

  const handleSelectVirtualBg = (index: VirtualBg) => {
    setSelectedVirtualBg(index);
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="typo-xs600">{t("virtual_background")}</p>
        <Switch checked={isVirtualBgOn} onChange={handleToggleVirtualBg} />
      </div>

      <div className={cn("typo-2xs400 mt-[4px] grid h-[140px] grid-cols-2 gap-[8px]", isVirtualBgOn || "opacity-40")}>
        {virtualBg.map((bg, index) => (
          <div
            key={index}
            className={cn(
              "align-center-center rounded border bg-grey-200 bg-contain",
              isVirtualBgOn && "cursor-pointer",
              index === selectedVirtualBg && "border-primary-600",
              index === 1 && "bg-[url('/src/assets/images/blue.png')] text-transparent",
              index === 2 && "bg-[url('/src/assets/images/house.png')] text-transparent",
              index === 3 && "bg-[url('/src/assets/images/office.png')] text-transparent",
            )}
            onClick={() => handleSelectVirtualBg(index)}
          >
            {t(bg)}
          </div>
        ))}
      </div>
      {!!camError && <p className="typo-2xs600 mt-[4px] pl-[4px] text-red-500">{t("camera_required_for_selection")}</p>}
    </div>
  );
}

export default VirtualBgSet;
