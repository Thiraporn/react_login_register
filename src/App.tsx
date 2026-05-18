import { Routes, Route } from "react-router-dom";
import { Container } from "@/components/layout";
import {
  Home,
  AuthenticationForm,
  Page404,
  Page500,
  Contact,
  Unauthorized,
  PersistLogin,
  FromElements,
  ManageMenus,
  ManageUsers,
  ManagePermissions,
} from "@/components/views";
import NormalizePath from "@/context/NormalizePath";
import ModalProvider from "@/context/ModalProvider";
import ProtectedRoute from "@/context/ProtectedRoute";
function App() {
  return (
    <>
      {/* Gobal Modal Provider เพื่อให้ทุกที่ในแอปใช้ modal ได้ง่ายๆ โดยไม่ต้องผ่าน prop drilling */}
      <ModalProvider>
        {/* prevent multiple slashes in URL and redirect to normalized path */}
        <NormalizePath />

        <Routes>
          <Route path="/" element={<AuthenticationForm />} />
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/signup" element={<AuthenticationForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/Page500" element={<Page500 />} />
          <Route element={<Container />}>
            <Route element={<PersistLogin />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/Contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/ManageMenus" element={<ProtectedRoute> <ManageMenus /> </ProtectedRoute>} />
              <Route path="/ManageUsers" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
              <Route path="/ManagePermissions" element={<ProtectedRoute><ManagePermissions /></ProtectedRoute>} />
              {/* <Route path="/FromElements" element={<ProtectedRoute><FromElements /></ProtectedRoute>} /> */}
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </ModalProvider>
    </>
  );
}

export default App;
