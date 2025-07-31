import MimeTypePage from "./pages/MimeTypePage";

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
];

export default pages;
