import { useState } from "react";
import ToggleSwitch from "../components/ToggleSwitch";
import useMediaPermission from "../hooks/useMediaPermission";

// 장치 목록 및 설정
const CAM_OPTIONS = [
  { value: "카메라 1", label: "카메라 1" },
  { value: "카메라 2", label: "카메라 2" },
  { value: "카메라 3", label: "카메라 3" },
];

const MIC_OPTIONS = [
  { value: "마이크 1", label: "마이크 1" },
  { value: "마이크 2", label: "마이크 2" },
  { value: "마이크 3", label: "마이크 3" },
];

const SPK_OPTIONS = [
  { value: "스피커 1", label: "스피커 1" },
  { value: "스피커 2", label: "스피커 2" },
  { value: "스피커 3", label: "스피커 3" },
];

const DEFAULT_CAM = CAM_OPTIONS[0].value;
const DEFAULT_MIC = MIC_OPTIONS[0].value;
const DEFAULT_SPK = SPK_OPTIONS[0].value;

export default function DeviceTestPage() {
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [spkEnabled, setSpkEnabled] = useState(true);
  const [selectedCam, setSelectedCam] = useState(DEFAULT_CAM);
  const [selectedMic, setSelectedMic] = useState(DEFAULT_MIC);
  const [selectedSpk, setSelectedSpk] = useState(DEFAULT_SPK);

  useMediaPermission();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 웹캠 화면 영역 */}
          <div className="p-6 xl:col-span-2">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <video className="w-full h-full object-cover rounded-lg" autoPlay muted playsInline />
            </div>
          </div>

          {/* 설정 패널 */}
          <div className="p-6">
            {/* 카메라 설정 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">카메라</label>
                <ToggleSwitch enabled={camEnabled} onChange={setCamEnabled} />
              </div>
              <select
                value={selectedCam}
                onChange={(e) => setSelectedCam(e.target.value)}
                disabled={!camEnabled}
                className={`w-full p-2 border rounded-md text-sm ${
                  camEnabled ? "border-gray-300 bg-white text-gray-900" : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                {CAM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!camEnabled && <p className="text-xs text-red-500 mt-1">카메라 에러 문구가 표시됩니다.</p>}
            </div>

            {/* 마이크 설정 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">마이크</label>
                <ToggleSwitch enabled={micEnabled} onChange={setMicEnabled} />
              </div>
              <select
                value={selectedMic}
                onChange={(e) => setSelectedMic(e.target.value)}
                disabled={!micEnabled}
                className={`w-full p-2 border rounded-md text-sm ${
                  micEnabled ? "border-gray-300 bg-white text-gray-900" : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                {MIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!micEnabled && <p className="text-xs text-red-500 mt-1">마이크 에러 문구가 표시됩니다.</p>}
            </div>

            {/* 스피커 설정 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">스피커</label>
                <ToggleSwitch enabled={spkEnabled} onChange={setSpkEnabled} />
              </div>
              <select
                value={selectedSpk}
                onChange={(e) => setSelectedSpk(e.target.value)}
                disabled={!spkEnabled}
                className={`w-full p-2 border rounded-md text-sm mb-3 ${
                  spkEnabled ? "border-gray-300 bg-white text-gray-900" : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                {SPK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!spkEnabled && <p className="text-xs text-red-500 mt-1">스피커 에러 문구가 표시됩니다.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
