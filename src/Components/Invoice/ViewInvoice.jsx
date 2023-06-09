import React, { useEffect, useState } from "react";
import EditImage from "../../assets/Icons/IconImg/Edit_Icon_For_Invoice.png";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Toaster, toast } from "react-hot-toast";
import Layout from "../../Layout/Layout";

export default function EditInvoice() {
  const [routeId, setRouteId] = useState("");
  const [routeName, setRouteName] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [tripType, setTripType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [noOfPickup, setNoOfPickup] = useState("");
  const [tripAmount, setTripAmount] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverVehicleType, setDriverVehicleType] = useState("");
  const [driverVehicleName, setDriverVehicleName] = useState("");
  const [driverVehicleNumber, setDriverVehicleNumber] = useState("");
  const [driverId, setDriverId] = useState("");
  const [viewPage, setViewPage] = useState(true);

  const [invoicePaidAmount, setInvoicePaidAmount] = useState("");
  const [invoicePaidAmountError, setInvoicePaidAmountError] = useState("");
  const [invoicePaymentDate, setInvoicePaymentDate] = useState("");
  const [invoicePaymentDateError, setInvoicePaymentDateError] = useState("");
  const [invoicePaymentStatus, setInvoicePaymentStatus] = useState("");
  const [invoicePaymentStatusError, setInvoicePaymentStatusError] =
    useState("");
  const [invoicePaymentMode, setInvoicePaymentMode] = useState("");
  const [invoicePaymentModeError, setInvoicePaymentModeError] = useState("");
  const [invoiceTransactionId, setInvoiceTransactionId] = useState("");
  const [invoiceTransactionIdError, setInvoiceTransactionIdError] =
    useState("");
  const [invoicePaidBy, setInvoicePaidBy] = useState("");
  const [invoicePaidByError, setInvoicePaidByError] = useState("");

  const { invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTripById(invoiceId);
  }, []);

  const getTripById = async (searchId) => {
    try {
      const tripDocRef = doc(db, "corporateTrips", searchId);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data();

        console.log(tripData);

        setRouteId(tripData.routeId);
        setRouteName(tripData.routeName);
        setTripDate(tripData.tripDate);
        setShiftTime(tripData.shiftTime);
        setFromLocation(tripData.fromLocation);
        setToLocation(tripData.toLocation);
        setTripType(tripData.tripType);
        setVehicleType(tripData.vehicleType);
        setNoOfPickup(tripData.noOfPickup);
        setTripAmount(tripData.tripAmount);

        getDriverById(tripData.allocatedDriver);

        // Retrieve invoice data if available
        const invoiceDetailsCollectionRef = collection(
          tripDocRef,
          "invoiceDetails"
        );
        const invoiceSnapshot = await getDocs(invoiceDetailsCollectionRef);
        if (!invoiceSnapshot.empty) {
          const invoiceData = invoiceSnapshot.docs[0].data();
          // Assuming you have individual state variables to store invoice data
          setInvoicePaidAmount(invoiceData.invoicePaidAmount);
          setInvoicePaymentDate(invoiceData.invoicePaymentDate);
          setInvoicePaymentStatus(invoiceData.invoicePaymentStatus);
          setInvoicePaymentMode(invoiceData.invoicePaymentMode);
          setInvoiceTransactionId(invoiceData.invoiceTransactionId);
          setInvoicePaidBy(invoiceData.invoicePaidBy);
          setViewPage(false);
        }
      } else {
        console.log("Trip not found");
      }
    } catch (error) {
      console.error("Error getting trip:", error);
    }
  };

  const getDriverById = async (searchId) => {
    try {
      const tripDocRef = doc(db, "Drivers", searchId);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const driverData = tripSnapshot.data();

        setDriverId(driverData.driverID);
        setDriverName(driverData.driverName);
        setDriverVehicleNumber(driverData.vehicleNo);
        setDriverVehicleType(driverData.vehicleType);
        setDriverVehicleName(driverData.vehicleName);
      } else {
        console.log("Driver not found");
      }
    } catch (error) {
      console.error("Error getting Driver:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        const tripDocRef = doc(db, "corporateTrips", invoiceId);
        const invoiceDetailsCollectionRef = collection(
          tripDocRef,
          "invoiceDetails"
        );

        // Delete previous invoice data
        const querySnapshot = await getDocs(invoiceDetailsCollectionRef);
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });

        // Add new invoice data
        const invoiceData = {
          invoicePaidAmount: invoicePaidAmount,
          invoicePaymentDate: invoicePaymentDate,
          invoicePaymentStatus: invoicePaymentStatus,
          invoicePaymentMode: invoicePaymentMode,
          invoiceTransactionId: invoiceTransactionId,
          invoicePaidBy: invoicePaidBy,
        };
        await addDoc(invoiceDetailsCollectionRef, invoiceData);

        toast("Invoice Created Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/invoice-list");
        }, 2000);

        // Display a success message or perform any other action
        console.log("Invoice details added successfully!");
      } catch (e) {
        console.error("Error adding invoice details: ", e);
      }
    }
  };

  const handleDiscard = async (e) => {
    e.preventDefault();
    try {
      const tripDocRef = doc(db, "corporateTrips", invoiceId);
      const invoiceDetailsCollectionRef = collection(
        tripDocRef,
        "invoiceDetails"
      );

      // Delete previous invoice data
      const querySnapshot = await getDocs(invoiceDetailsCollectionRef);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      toast("Invoice Discard Successfully!", {
        icon: "👏",
        style: {
          borderRadius: "7px",
          background: "#222831",
          color: "#fff",
        },
      });

      setTimeout(() => {
        navigate("/invoice-list");
      }, 2000);

      // Display a success message or perform any other action
      console.log("Invoice discard successfully!");
    } catch (e) {
      console.error("Error discard invoice details: ", e);
    }
  };

  const handleFormValidation = () => {
    let formIsValid = true;

    if (!invoicePaidAmount) {
      formIsValid = false;
      setInvoicePaidAmountError("Please enter paid amount");
    } else {
      setInvoicePaidAmountError("");
    }

    if (!invoicePaymentDate) {
      formIsValid = false;
      setInvoicePaymentDateError("Please enter payment date");
    } else {
      setInvoicePaymentDateError("");
    }

    if (!invoicePaymentStatus) {
      formIsValid = false;
      setInvoicePaymentStatusError("Please enter payment status");
    } else {
      setInvoicePaymentStatusError("");
    }

    if (invoicePaymentMode == "") {
      formIsValid = false;
      setInvoicePaymentModeError("Please enter payment mode");
    } else {
      setInvoicePaymentModeError("");
    }

    if (invoiceTransactionId == "") {
      formIsValid = false;
      setInvoiceTransactionIdError("Please enter transaction id");
    } else {
      setInvoiceTransactionIdError("");
    }

    if (invoicePaidBy == "") {
      formIsValid = false;
      setInvoicePaidByError("Please enter paid by");
    } else {
      setInvoicePaidByError("");
    }

    return formIsValid;
  };

  return (
    <Layout>
      <div>
        <div>
          <Toaster />
          <div class="bg-gray-100 ">
            <div class="container mx-auto">
              <div class="flex justify-center m-2">
                <h1 class="text-3xl font-bold">Trip Payment Details</h1>
              </div>
              <div class="grid grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-lg shadow-md">
                  <h2 class="text-xl font-bold m-2">Trip Details</h2>
                  <p>
                    <span class="font-semibold">Route ID:</span> {routeId}
                  </p>
                  <p>
                    <span class="font-semibold">Route Name:</span> {routeName}
                  </p>
                  <p>
                    <span class="font-semibold">From Location:</span>{" "}
                    {fromLocation}
                  </p>
                  <p>
                    <span class="font-semibold">To Location:</span> {toLocation}
                  </p>
                  <p>
                    <span class="font-semibold">Trip Date:</span> {tripDate}
                  </p>
                </div>
                <div class="bg-white p-8 rounded-lg shadow-md">
                  <h2 class="text-xl font-bold m-2">Trip Summary</h2>
                  <p>
                    <span class="font-semibold">No of Pickups:</span>{" "}
                    {noOfPickup}
                  </p>
                  <p>
                    <span class="font-semibold">Vehicle Type:</span>{" "}
                    {vehicleType}
                  </p>
                  <p>
                    <span class="font-semibold">Shift Time:</span> {shiftTime}
                  </p>
                  <p>
                    <span class="font-semibold">Trip Amount:</span> {tripAmount}
                  </p>
                  <p>
                    <span class="font-semibold">Trip Type:</span> {tripType}
                  </p>
                </div>
                <div class="bg-white p-8 rounded-lg shadow-md">
                  <h2 class="text-xl font-bold m-2">
                    Driver &amp; Vehicle Details
                  </h2>
                  <p>
                    <span class="font-semibold">Driver ID:</span> {driverId}
                  </p>
                  <p>
                    <span class="font-semibold">Driver Name:</span> {driverName}
                  </p>
                  <p>
                    <span class="font-semibold">Vehicle Number:</span>{" "}
                    {driverVehicleNumber}
                  </p>
                  <p>
                    <span class="font-semibold">Vehicle Type:</span>{" "}
                    {driverVehicleType}
                  </p>
                  <p>
                    <span class="font-semibold">Vehicle Name:</span>{" "}
                    {driverVehicleName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 mt-4">
          <div class="container mx-auto shadow-lg p-2x">
            <div class="bg-white p-8 rounded-lg shadow-md">
              {!viewPage && (
                <div className="flex justify-end">
                  <Link>
                    <button onClick={() => setViewPage(true)}>
                      <img src={EditImage} alt="Edit" />
                    </button>
                  </Link>
                </div>
              )}

              <div class="grid grid-cols-3 gap-8 mt-5">
                <div class="mb-4">
                  <label for="paid-amount" class="block font-semibold mb-1">
                    Paid Amount
                  </label>
                  <input
                    id="paid-amount"
                    type="text"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoicePaidAmount(e.target.value)}
                    value={invoicePaidAmount}
                    disabled={!viewPage}
                  />
                  {invoicePaidAmountError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoicePaidAmountError}
                    </p>
                  )}
                </div>
                <div class="mb-4">
                  <label for="payment-date" class="block font-semibold mb-1">
                    Payment Date
                  </label>
                  <input
                    id="payment-date"
                    type="date"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoicePaymentDate(e.target.value)}
                    value={invoicePaymentDate}
                    disabled={!viewPage}
                  />
                  {invoicePaymentDateError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoicePaymentDateError}
                    </p>
                  )}
                </div>
                <div class="mb-4">
                  <label for="payment-status" class="block font-semibold mb-1">
                    Payment Status
                  </label>
                  <select
                    id="payment-status"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoicePaymentStatus(e.target.value)}
                    value={invoicePaymentStatus}
                    disabled={!viewPage}
                  >
                    <option value="">--- Select Payment Status ---</option>
                    <option value="Paid">Paid</option>
                    <option value="Not Paid">Not Paid</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  {invoicePaymentStatusError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoicePaymentStatusError}
                    </p>
                  )}
                </div>

                <div class="mb-4">
                  <label for="payment-mode" class="block font-semibold mb-1">
                    Payment Mode
                  </label>
                  <input
                    id="payment-mode"
                    type="text"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoicePaymentMode(e.target.value)}
                    value={invoicePaymentMode}
                    disabled={!viewPage}
                  />
                  {invoicePaymentModeError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoicePaymentModeError}
                    </p>
                  )}
                </div>
                <div class="mb-4">
                  <label for="transaction-id" class="block font-semibold mb-1">
                    Transaction ID
                  </label>
                  <input
                    id="transaction-id"
                    type="text"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoiceTransactionId(e.target.value)}
                    value={invoiceTransactionId}
                    disabled={!viewPage}
                  />
                  {invoiceTransactionIdError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoiceTransactionIdError}
                    </p>
                  )}
                </div>
                <div class="mb-4">
                  <label for="paid-by" class="block font-semibold mb-1">
                    Paid By
                  </label>
                  <input
                    id="paid-by"
                    type="text"
                    class="w-full border-gray-400 border-2 p-2 rounded"
                    onChange={(e) => setInvoicePaidBy(e.target.value)}
                    value={invoicePaidBy}
                    disabled={!viewPage}
                  />
                  {invoicePaidByError && (
                    <p className=" text-red-500 text-sm mt-1">
                      {invoicePaidByError}
                    </p>
                  )}
                </div>
              </div>

              {viewPage && (
                <div className="flex justify-center mt-4">
                  <Link
                    // to="/invoice/"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Link>
                  <Link
                    // to="/invoice/"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDiscard}
                  >
                    Discard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
