import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

import { VirtualBg } from "@enums";

type CamSlice = {
  isCamOn: boolean;
  camError: Error | null;
  cams: MediaDeviceInfo[];
  selectedCamId: string;

  camActions: {
    toggleCam: () => void;
    setCamError: (error: Error | null) => void;
    setCams: (cams: MediaDeviceInfo[]) => void;
    setSelectedCamId: (camId: string) => void;
  };
};

type MicSlice = {
  isMicOn: boolean;
  micError: Error | null;
  mics: MediaDeviceInfo[];
  selectedMicId: string;
  threshold: number;
  volume: number;
  isNoiseSuppressionOn: boolean;

  micActions: {
    toggleMic: () => void;
    setMicError: (micError: Error | null) => void;
    setMics: (mics: MediaDeviceInfo[]) => void;
    setSelectedMicId: (micId: string) => void;
    setThreshold: (threshold: number) => void;
    setVolume: (volume: number) => void;
    toggleNoiseSuppression: () => void;
  };
};

type SpeakerSlice = {
  isSpeakerOn: boolean;
  speakerError: Error | null;
  speakers: MediaDeviceInfo[];
  selectedSpeakerId: string;

  speakerActions: {
    toggleSpeaker: () => void;
    setSpeakerError: (speakerError: Error | null) => void;
    setSpeakers: (speakers: MediaDeviceInfo[]) => void;
    setSelectedSpeakerId: (speakerId: string) => void;
  };
};

type VirtualBgSlice = {
  isVirtualBgOn: boolean;
  selectedVirtualBg: VirtualBg;

  virtualBgActions: {
    toggleVirtualBg: () => void;
    setSelectedVirtualBg: (selectedVirtualBg: VirtualBg) => void;
  };
};

type DeviceState = CamSlice & MicSlice & SpeakerSlice & VirtualBgSlice;

const createCamSlice: StateCreator<DeviceState, [["zustand/devtools", never]], [], CamSlice> = (set, get) => ({
  isCamOn: true,
  camError: null,
  cams: [],
  selectedCamId: "",

  camActions: {
    toggleCam: () => {
      const { isCamOn, camError } = get();
      if (!camError) {
        set({ isCamOn: !isCamOn });
      }
    },
    setCamError: (camError) => {
      const { isVirtualBgOn } = get();
      set({ camError, isCamOn: !camError, isVirtualBgOn: camError ? false : isVirtualBgOn });
    },
    setCams: (cams) => {
      const { selectedCamId } = get();
      const isSelectedCamAvailable = cams.some((cam) => cam.deviceId === selectedCamId);
      set({ cams, selectedCamId: isSelectedCamAvailable ? selectedCamId : cams[0]?.deviceId || "" });
    },
    setSelectedCamId: (camId) => set({ selectedCamId: camId }),
  },
});

const createMicSlice: StateCreator<DeviceState, [["zustand/devtools", never]], [], MicSlice> = (set, get) => ({
  isMicOn: true,
  micError: null,
  mics: [],
  selectedMicId: "",
  threshold: 8,
  volume: 0,
  isNoiseSuppressionOn: true,

  micActions: {
    toggleMic: () => {
      const { isMicOn, micError } = get();
      if (!micError) {
        set({ isMicOn: !isMicOn });
      }
    },
    setMicError: (micError) => set({ micError, isMicOn: !micError }),
    setMics: (mics) => {
      const { selectedMicId } = get();
      const isSelectedMicAvailable = mics.some((mic) => mic.deviceId === selectedMicId);
      set({ mics, selectedMicId: isSelectedMicAvailable ? selectedMicId : mics[0]?.deviceId || "" });
    },
    setSelectedMicId: (micId) => set({ selectedMicId: micId }),
    setThreshold: (threshold) => set({ threshold }),
    setVolume: (volume) => set({ volume }),
    toggleNoiseSuppression: () => set((state) => ({ isNoiseSuppressionOn: !state.isNoiseSuppressionOn })),
  },
});

const createSpeakerSlice: StateCreator<DeviceState, [["zustand/devtools", never]], [], SpeakerSlice> = (set, get) => ({
  isSpeakerOn: false,
  speakerError: null,
  speakers: [],
  selectedSpeakerId: "",

  speakerActions: {
    toggleSpeaker: () => {
      const { isSpeakerOn, speakerError } = get();
      if (!speakerError) {
        set({ isSpeakerOn: !isSpeakerOn });
      }
    },
    setSpeakerError: (speakerError) => set({ speakerError, isSpeakerOn: !speakerError }),
    setSpeakers: (speakers) => {
      const { selectedSpeakerId } = get();
      const isSelectedSpeakerAvailable = speakers.some((speaker) => speaker.deviceId === selectedSpeakerId);
      set({ speakers, selectedSpeakerId: isSelectedSpeakerAvailable ? selectedSpeakerId : speakers[0]?.deviceId || "" });
    },
    setSelectedSpeakerId: (speakerId) => set({ selectedSpeakerId: speakerId }),
  },
});

const createVirtualBgSlice: StateCreator<DeviceState, [], [], VirtualBgSlice> = (set, get) => ({
  isVirtualBgOn: true,
  selectedVirtualBg: VirtualBg.Blur,

  virtualBgActions: {
    toggleVirtualBg: () => {
      const { camError, isVirtualBgOn } = get();
      if (!camError) {
        set({ isVirtualBgOn: !isVirtualBgOn });
      }
    },
    setSelectedVirtualBg: (selectedVirtualBg) => {
      const { isVirtualBgOn } = get();
      if (isVirtualBgOn) {
        set({ selectedVirtualBg });
      }
    },
  },
});

export const useDeviceStore = create<DeviceState, [["zustand/devtools", never]]>(
  devtools((...args) => ({
    ...createCamSlice(...args),
    ...createMicSlice(...args),
    ...createSpeakerSlice(...args),
    ...createVirtualBgSlice(...args),
  })),
);

export const useDeviceActions = () => {
  const camActions = useDeviceStore((state) => state.camActions);
  const micActions = useDeviceStore((state) => state.micActions);
  const speakerActions = useDeviceStore((state) => state.speakerActions);
  const virtualBgActions = useDeviceStore((state) => state.virtualBgActions);
  return { ...camActions, ...micActions, ...speakerActions, ...virtualBgActions };
};
