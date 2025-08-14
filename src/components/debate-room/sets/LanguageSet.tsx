import { useTranslation } from "react-i18next";

import { Option, Select } from "@/components";

function LanguageSet() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div>
      {/* TODO: 위치 및 UI 변경 */}
      <p className="typo-xs600">{t("language")}</p>
      <Select size="2xs" value={i18n.language} onChange={handleLanguageChange} className="mt-[4px]">
        <Option value="en" label="English" />
        <Option value="ko" label="한국어" />
      </Select>
    </div>
  );
}

export default LanguageSet;
