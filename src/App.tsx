import React from "react";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Welcome from "./components/Welcome";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorComponent from "./components/ErrorComponent";
import Signup from "./components/Signup";
import TodosComponent from "./components/TodosComponent";
import FooterComponent from "./components/FooterComponent";

const App: React.FC = () => {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/todos" element={<TodosComponent />} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </BrowserRouter>
      <hr />
      <FooterComponent />
    </div>
  );
};

export default App;
