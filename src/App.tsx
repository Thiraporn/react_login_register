import { Routes, Route } from "react-router-dom";
import { Container } from "@/components/layout";
import { Home, AuthenticationForm, Page404, Page500, Profile, Unauthorized,PersistLogin ,FromElements, ManageMenus, ManageUsers} from "@/components/views";
import NormalizePath from "@/context/NormalizePath";      
import ModalProvider from "./context/ModalProvider";
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
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path="/Page500" element={<Page500 />} /> 
            <Route element={<Container />}>
              <Route element={<PersistLogin />}> 
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ManageMenus" element={<ManageMenus />} />
                <Route path="/ManageUsers" element={<ManageUsers />} />
                <Route path="/FromElements" element={<FromElements />} /> 
              </Route>
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>  
      
     </ModalProvider> 
    </>
  );
}

export default App;
