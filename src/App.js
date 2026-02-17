import { Routes, Route } from "react-router-dom";
import AuthenticationForm from "./components/AuthenticationForm";
function App() {
  return (
     <Routes>
      <Route path="/" element={<AuthenticationForm />} />
      <Route path="/login" element={<AuthenticationForm />} />
      <Route path="/signup" element={<AuthenticationForm />} />
    </Routes>
  );
}

export default App;
