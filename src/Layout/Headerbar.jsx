import React from "react";
import { useLocation, useHistory, useNavigate } from "react-router-dom";
import AddTripButton from './Buttons/AddTripButton';
import AddDriverButton from "./Buttons/AddDriverButton";
import AddEmployeeButton from "./Buttons/AddEmployeeButton";
import CreateInvoice from "./Buttons/CreateInvoice";
import { HiOutlineLogout } from 'react-icons/hi';
import Swal from "sweetalert2";


const HeaderBar = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const TripLogic = location.pathname === '/Trip' ? 'Trip' : 'AddTrip';
  const HomeLogic = location.pathname === '/Home' ? 'Home' : 'bulk';
  const DriverLogic = location.pathname === '/Driver' ? 'Driver' : 'addDriver';
  const EmployeeLogic = location.pathname === '/Employee' ? 'Employee' : 'addEmployee';
  const InvoiceLogic = location.pathname === '/Invoice' ? 'Invoice' : 'CreateInvoices';


  const handleLogout = () => {


    Swal.fire({
      title: 'You want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00adb5',
      confirmButtonText: 'Yes,logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout action here
        console.log('User has been logged out');
        navigate('/');
      }
    });
  };




  return (
    <>

      <header class="flex items-center h-[70px] px-6 sm:px-10 relative bg-[#00ADB5]">

        <div>
          {TripLogic === 'Trip' ? (
            <AddTripButton />
          ) : null}

          {DriverLogic === 'Driver' ? (
            <AddDriverButton />
          ) : null}

          {EmployeeLogic === 'Employee' ? (
            <AddEmployeeButton />
          ) : null}
          
          {InvoiceLogic === 'Invoice' ? (
            <CreateInvoice />
          ) : null}
        </div>
        <div class="flex flex-shrink-0 items-center ml-auto gap-3">
          <button class="inline-flex items-center p-2 hover:bg-gray-100  focus:bg-gray-100 rounded-lg">
            <span class="sr-only">User Menu</span>
            <div class="hidden md:flex md:flex-col md:items-end md:leading-tight">
              <span class="font-semibold text-black">Welcome Back !</span>
              <span class="text-sm text-gray-600">Admin !</span>
            </div>
            <span class="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-2xl border-2 border-black overflow-hidden">
              <img
                src="https://img.freepik.com/free-photo/handsome-stylish-indian-model-man-casual-close-posing-pastel-wall_496169-1577.jpg"
                class="h-full w-full object-cover rounded-2xl"
                alt="Mugesrao" />
            </span>
          </button>

          <button onClick={handleLogout} class="inline-flex items-center p-2 hover:bg-red-300  focus:bg-gray-100 rounded-lg">
            <HiOutlineLogout className="w-8 h-8  text-red-800" />

          </button>

        </div>
      </header>
    </>
  );
};

export default HeaderBar;
