import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import pages from "./pages";

function App() {
  return (
    <BrowserRouter basename="/media-test">
      <Routes>
        <Route path="/" element={<MainPage />} />
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={<page.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
