import { useSyncExternalStore } from "react";

type Listener = () => void;

type MediaStore = {
  camPermission: PermissionState | undefined;
  micPermission: PermissionState | undefined;
  devices: MediaDeviceInfo[];
  cams: MediaDeviceInfo[];
  mics: MediaDeviceInfo[];
  spks: MediaDeviceInfo[];
};

const createMediaStore = () => {
  let initialized = false;
  const listeners = new Set<Listener>();
  let camPermissionStatus: PermissionStatus | undefined;
  let micPermissionStatus: PermissionStatus | undefined;
  let store: MediaStore = {
    camPermission: undefined,
    micPermission: undefined,
    devices: [],
    cams: [],
    mics: [],
    spks: [],
  };

  // 상태 변경 알림 함수
  const emit = () => listeners.forEach((l) => l());

  // 카메라/마이크 권한 요청 함수
  const requestPermission = async () => {
    try {
      console.log("📷🎤 카메라/ 마이크 권한 요청 시작");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      console.log("📷🎤 카메라/ 마이크 권한 요청 성공");
    } catch (error) {
      console.error("📷🎤 카메라/ 마이크 권한 요청 실패", error);
    } finally {
      checkCamPermission();
      checkMicPermission();
    }
  };

  // 카메라 권한 요청 함수
  const requestCamPermission = async () => {
    try {
      console.log("📷 카메라 권한 요청 시작");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      console.log("📷 카메라 권한 요청 성공");
    } catch (error) {
      console.error("📷 카메라 권한 요청 실패", error);
    } finally {
      checkCamPermission();
    }
  };

  // 마이크 권한 요청 함수
  const requestMicPermission = async () => {
    try {
      console.log("🎤 마이크 권한 요청 시작");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      console.log("🎤 마이크 권한 요청 성공");
    } catch (error) {
      console.error("🎤 마이크 권한 요청 실패", error);
    } finally {
      checkMicPermission();
    }
  };

  const checkDevices = async () => {
    let devices: MediaDeviceInfo[] = [];
    let cams: MediaDeviceInfo[] = [];
    let mics: MediaDeviceInfo[] = [];
    let spks: MediaDeviceInfo[] = [];
    try {
      console.log("📋 장치 목록 확인 시작");
      devices = await navigator.mediaDevices.enumerateDevices();
      cams = devices.filter((device) => device.kind === "videoinput");
      mics = devices.filter((device) => device.kind === "audioinput");
      spks = devices.filter((device) => device.kind === "audiooutput");
      console.log("📋 장치 목록 확인 성공", devices);
    } catch (error) {
      console.error("📋 장치 목록 확인 실패", error);
    } finally {
      store = {
        ...store,
        devices,
        cams,
        mics,
        spks,
      };
      emit();
    }
  };

  const checkCamPermission = async () => {
    console.log("📷 카메라 권한 확인 시작");
    let camPermission: PermissionState | undefined;
    try {
      camPermissionStatus = await navigator.permissions.query({ name: "camera" });
      camPermission = camPermissionStatus.state;
      console.log("📷 카메라 권한 확인 성공", camPermission);
    } catch (error) {
      console.log("📷 카메라 권한 확인 실패", error);
    } finally {
      store = {
        ...store,
        camPermission,
      };
      emit();
    }
  };

  const checkMicPermission = async () => {
    let micPermission: PermissionState | undefined;
    try {
      console.log("🎤 마이크 권한 확인 시작");
      micPermissionStatus = await navigator.permissions.query({ name: "microphone" });
      micPermission = micPermissionStatus.state;
      console.log("🎤 마이크 권한 확인 성공", micPermission);
    } catch (error) {
      console.log("🎤 마이크 권한 확인 실패", error);
    } finally {
      store = {
        ...store,
        micPermission,
      };
      emit();
    }
  };

  const onDeviceChange = () => {
    console.log("📋 장치 목록 변경 이벤트 발생");
    checkDevices();
  };

  const onCamPermissionChange = (e: Event) => {
    console.log("📷 카메라 권한 변경 이벤트 발생", e);
    checkDevices();
    checkCamPermission();
  };

  const onMicPermissionChange = (e: Event) => {
    console.log("🎤 마이크 권한 변경 이벤트 발생", e);
    checkDevices();
    checkMicPermission();
  };

  // 미디어 스토어 초기화 함수
  const initialize = async () => {
    console.log("미디어 스토어 초기화 시작");
    await checkDevices();
    await checkCamPermission();
    await checkMicPermission();

    // 장치 목록 변경 이벤트 리스너 등록
    navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
    console.log("📋 장치 목록 변경 이벤트 리스너 등록 성공");

    // 카메라 권한 변경 이벤트 리스너 등록
    if (camPermissionStatus) {
      camPermissionStatus.addEventListener("change", onCamPermissionChange);
      console.log("📷 카메라 권한 변경 이벤트 리스너 등록 성공");
    } else {
      console.log("📷 카메라 권한 변경 이벤트 리스너 등록 실패");
    }

    // 마이크 권한 변경 이벤트 리스너 등록
    if (micPermissionStatus) {
      micPermissionStatus.addEventListener("change", onMicPermissionChange);
      console.log("🎤 마이크 권한 변경 이벤트 리스너 등록 성공");
    } else {
      console.log("🎤 마이크 권한 변경 이벤트 리스너 등록 실패");
    }
  };

  // 미디어 스토어 소멸 함수
  const destroy = () => {
    console.log("미디어 스토어 소멸 시작");

    // 장치 목록 변경 이벤트 리스너 제거
    navigator.mediaDevices.removeEventListener("devicechange", onDeviceChange);
    console.log("📋 장치 목록 변경 이벤트 리스너 제거 성공");

    // 카메라 권한 변경 이벤트 리스너 제거
    if (camPermissionStatus) {
      camPermissionStatus.removeEventListener("change", onCamPermissionChange);
      console.log("📷 카메라 권한 변경 이벤트 리스너 제거 성공");
      camPermissionStatus = undefined;
    }

    // 마이크 권한 변경 이벤트 리스너 제거
    if (micPermissionStatus) {
      micPermissionStatus.removeEventListener("change", onMicPermissionChange);
      console.log("🎤 마이크 권한 변경 이벤트 리스너 제거 성공");
      micPermissionStatus = undefined;
    }
  };

  return {
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      let timeoutId: NodeJS.Timeout | null = null;
      if (listeners.size === 1) {
        timeoutId = setTimeout(() => {
          if (!initialized) {
            initialize();
            initialized = true;
          }
        }, 0);
      }

      // 구독 해지 클린업 함수
      return () => {
        listeners.delete(listener);

        if (listeners.size === 0) {
          destroy();
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }
      };
    },
    getSnapshot: () => store,
    requestPermission,
    requestCamPermission,
    requestMicPermission,
  };
};

const mediaStore = createMediaStore();

export default function useMediaStore() {
  return {
    ...useSyncExternalStore(mediaStore.subscribe, mediaStore.getSnapshot),
    requestPermission: mediaStore.requestPermission,
    requestCamPermission: mediaStore.requestCamPermission,
    requestMicPermission: mediaStore.requestMicPermission,
  };
}
