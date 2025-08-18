import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../context/context";

export default function Navbar() {
  const {user}=useUserContext()
  return (
    <div>
       <nav className="border-b border-appleBorder bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-appleBlack text-lg font-semibold">SpaceSync</Link>
        <div className="flex space-x-6 text-appleGray">
          <Link to='my-bookings'>My Bookings</Link>
        </div>
      </div>
    </nav>
    <div className=" min-h-screen bg-gray-200">
      {<Outlet></Outlet>}
    </div>
    </div>
   
  );
}
