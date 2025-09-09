import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Mainpage from "./pages/Mainpage";
import SignIn from "./pages/signIn";
import Signup from "./pages/signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
