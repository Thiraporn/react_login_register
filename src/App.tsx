import { Routes, Route } from "react-router-dom";
import { Container } from "./components/layout";
import { Home, AuthenticationForm, Page404 ,Page500, Profile } from "./components/views";
import NormalizePath from "./context/NormalizePath";

function App() {
  return (
    <>
      {/* prevent multiple slashes in URL and redirect to normalized path */}
      <NormalizePath />
      <Routes>
        <Route path="/login" element={<AuthenticationForm />} />
        <Route path="/signup" element={<AuthenticationForm />} />
        <Route element={<Container />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Page500" element={<Page500 />} />
          <Route path="*" element={<Page404 />} />

        </Route>
      </Routes>
    </>

  );
}

export default App;
