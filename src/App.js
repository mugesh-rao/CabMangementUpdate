import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/SignIn";
import Home from "./Components/Home/Home";
import DriversList from "./Components/Driver/DriverList";
import AddEditViewDriver from "./Components/Driver/AddEditViewDriver";

import AddEditViewEmployee from "./Components/Employee/AddEditViewEmployee";
import EmployeeList from "./Components/Employee/EmployeeList";
import AddTrip from "./components/TripManagement/AddTrip";
import TripList from "./components/TripManagement/TripList";
import EditViewTrip from "./components/TripManagement/EditViewTrip";
import InvoiceList from "./Components/Invoice/InvoiceList";
import ViewInvoice from "./Components/Invoice/ViewInvoice";

// Example authentication check
const isAuthenticated = () => {
  const user = localStorage.getItem("loginAuth");
  
  if (user === null) {
    alert("You are not logged in. Please log in to access this page.");
  }
  
  return user !== null;
};


// Higher-order component for protected routes
const ProtectedRoute = ({ path, element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <div className="font-sf_bold">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

            <Route path="/driver-list" element={<ProtectedRoute element={<DriversList />} />} />
            <Route path="/add-driver" element={<ProtectedRoute element={<AddEditViewDriver />} />} />
            <Route path="/view-driver/:id" element={<ProtectedRoute element={<AddEditViewDriver />} />} />

            <Route path="/employee-list" element={<ProtectedRoute element={<EmployeeList />} />} />
            <Route path="/add-employee" element={<ProtectedRoute element={<AddEditViewEmployee />} />} />
            <Route path="/view-employee/:id" element={<ProtectedRoute element={<AddEditViewEmployee />} />} />

            <Route path="/trip-list" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/add-trip" element={<ProtectedRoute element={<AddTrip />} />} />
            <Route path="/view-trip/:id" element={<ProtectedRoute element={<EditViewTrip />} />} />

            <Route path="/invoice-list" element={<ProtectedRoute element={<InvoiceList />} />} />
            <Route path="/view-invoice/:invoiceId" element={<ProtectedRoute element={<ViewInvoice />} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
