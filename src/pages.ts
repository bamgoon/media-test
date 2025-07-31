import MimeTypePage from "./pages/MimeTypePage";
import DeviceTestPage from "./pages/DeviceTestPage";

const pages: {
  name: string;
  path: string;
  description: string;
  component: React.ComponentType;
}[] = [
  {
    name: "MIME 타입 지원 체크 페이지",
    path: "/mime-type",
    description: "브라우저의 MIME 타입 지원 여부를 확인할 수 있습니다.",
    component: MimeTypePage,
  },
  {
    name: "장치 테스트 페이지",
    path: "/device-test",
    description: "카메라, 마이크, 스피커 테스트를 할 수 있습니다.",
    component: DeviceTestPage,
  },
];

export default pages;
