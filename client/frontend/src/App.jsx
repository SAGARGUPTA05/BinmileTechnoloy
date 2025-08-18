import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MyBookings from "./pages/MyBookings";
import BookRoom from "./pages/Bookroom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    
      <>
    
      <Routes>
        <Route path="/" element={<Navbar/>}>
        <Route path="/" element={<Home/>}></Route>
         <Route path="/book-room" element={<BookRoom/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />
        </Route>
       
      </Routes></>

  );
}
