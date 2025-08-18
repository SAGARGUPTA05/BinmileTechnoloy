import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/context.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <UserContextProvider>
        <App />
       <ToastContainer 
         position="bottom-right" 
        autoClose={1000}      
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
        backgroundColor: "#000",
        color: "#fff",           
      }}/>
    </UserContextProvider>
    
    </BrowserRouter>
  </StrictMode>
);
