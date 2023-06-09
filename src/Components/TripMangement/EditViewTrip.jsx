import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { db } from "../../firebase/config";
import DriverDetailsAlloted from "./EditTripComponent/DriverDetailsAlloted";
import FetchTripStatus from "./EditTripComponent/FetchTripStatus";
import AllocateDriver from "./EditTripComponent/AllocateDriver";
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
import Swal from "sweetalert2";
import axios from "axios";
import Layout from "../../Layout/Layout";

export default function EditTrip() {
  const [RouteId, setRouteId] = useState("");
  const [RouteName, setRouteName] = useState("");
  const [TripDate, setTripDate] = useState("");
  const [ShiftTime, setShiftTime] = useState("");
  const [FromLocation, setFromLocation] = useState("");
  const [ToLocation, setToLocation] = useState("");
  const [PickupTime, setPickupTime] = useState("");
  const [TripType, setTripType] = useState("");
  const [VehicleType, setVehicleType] = useState("");
  const [NoOfPickup, setNoOfPickup] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [TripAmount, setTripAmount] = useState("");
  const [CompanyList, setCompanyList] = useState([]);
  const [DriverList, setDriverList] = useState([]);
  const [PreEmployeesList, setPreEmployeesList] = useState([]);
  const [EmployeesList, setEmployeesList] = useState([]);
  const [SelectedEmployees, setSelectedEmployees] = useState([]);
  const [ViewTrip, setViewTrip] = useState(true);
  const [SelectedDriver, setSelectedDriver] = useState("");
  const [DriverName, setDriverName] = useState("");
  const [DriverMobileNumber, setDriverMobileNumber] = useState("");
  const [DriverVehicleType, setDriverVehicleType] = useState("");
  const [DriverVehicleNumber, setDriverVehicleNumber] = useState("");
  const [DriverId, setDriverId] = useState("");
  const [TripStatus, setTripStatus] = useState("");

  const [RouteIdError, setRouteIdError] = useState("");
  const [RouteNameError, setRouteNameError] = useState("");
  const [TripDateError, setTripDateError] = useState("");
  const [ShiftTimeError, setShiftTimeError] = useState("");
  const [FromLocationError, setFromLocationError] = useState("");
  const [ToLocationError, setToLocationError] = useState("");
  const [PickupTimeError, setPickupTimeError] = useState("");
  const [TripTypeError, setTripTypeError] = useState("");
  const [VehicleTypeError, setVehicleTypeError] = useState("");
  const [NoOfPickupError, setNoOfPickupError] = useState("");
  const [CompanyIdError, setCompanyIdError] = useState("");
  const [TripAmountError, setTripAmountError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = async () => {
    const fetchEmployeesByCompanyId = async (CompanyId) => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "corporateEmployees"),
          where("companyId", "==", CompanyId)
        )
      );

      const employeesList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (employeesList) {
        const convertedEmployeeList = employeesList.map((employee) => ({
          value: employee.id,
          label: employee.employeeId,
        }));
        setEmployeesList(convertedEmployeeList);
      } else {
        setEmployeesList([]);
      }
    };

    if (id) {
      getCompany();
      getDriver();
      getTripById(id);
      if (SelectedEmployees) {
        const convertedEmployeeList = SelectedEmployees.map((employee) => ({
          value: employee.id,
          label: employee.employeeId,
        }));
        setPreEmployeesList(convertedEmployeeList);
      } else {
        setPreEmployeesList([]);
      }

      await fetchEmployeesByCompanyId(CompanyId);
    } else {
      setViewTrip(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, CompanyId]);

  const getTripById = async (searchId) => {
    try {
      const tripDocRef = doc(db, "corporateTrips", searchId);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data();
        const selectedEmployeesSnapshot = await getDocs(
          collection(db, "corporateTrips", searchId, "selectedEmployees")
        );
        const selectedEmployeesData = selectedEmployeesSnapshot.docs.map(
          (doc) => doc.data()
        );

        const tripWithSelectedEmployees = {
          id: tripSnapshot.id,
          ...tripData,
          selectedEmployees: selectedEmployeesData,
        };

        setRouteId(tripWithSelectedEmployees.routeId);
        setRouteName(tripWithSelectedEmployees.routeName);
        setTripDate(tripWithSelectedEmployees.tripDate);
        setShiftTime(tripWithSelectedEmployees.shiftTime);
        setFromLocation(tripWithSelectedEmployees.fromLocation);
        setToLocation(tripWithSelectedEmployees.toLocation);
        setPickupTime(tripWithSelectedEmployees.pickupTime);
        setTripType(tripWithSelectedEmployees.tripType);
        setVehicleType(tripWithSelectedEmployees.vehicleType);
        setNoOfPickup(tripWithSelectedEmployees.noOfPickup);
        setCompanyId(tripWithSelectedEmployees.companyId);
        setTripAmount(tripWithSelectedEmployees.tripAmount);
        setSelectedEmployees(tripWithSelectedEmployees.selectedEmployees);
        setTripStatus(tripWithSelectedEmployees.tripStatus);
        const driverId =
          tripWithSelectedEmployees && tripWithSelectedEmployees.allocatedDriver
            ? tripWithSelectedEmployees.allocatedDriver
            : null;

        setSelectedDriver(driverId);
        handleDriverChange({ target: { value: driverId } });
      } else {
        console.log("Trip not found");
      }
    } catch (error) {
      console.error("Error getting trip:", error);
    }
  };

  const UpdateTrip = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        const tripsCollectionRef = collection(db, "corporateTrips");
        const tripDocRef = doc(tripsCollectionRef, id);

        await updateDoc(tripDocRef, {
          routeId: RouteId,
          companyId: CompanyId,
          tripAmount: TripAmount,
          routeName: RouteName,
          tripDate: TripDate,
          shiftTime: ShiftTime,
          fromLocation: FromLocation,
          toLocation: ToLocation,
          pickupTime: PickupTime,
          tripType: TripType,
          vehicleType: VehicleType,
          noOfPickup: NoOfPickup,
          updatedAt: new Date().toISOString(),
        });

        // Sort SelectedEmployees based on pickupTime in ascending order
        const sortedSelectedEmployees = SelectedEmployees.sort((a, b) =>
          a.pickupTime.localeCompare(b.pickupTime)
        );

        const selectedEmployeesCollectionRef = collection(
          tripDocRef,
          "selectedEmployees"
        );

        // Delete all existing employee documents
        const querySnapshot = await getDocs(selectedEmployeesCollectionRef);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Add new employee documents
        for (const employee of sortedSelectedEmployees) {
          await addDoc(selectedEmployeesCollectionRef, employee);
        }

        toast("Trip Updated Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        // setTimeout(() => {
        //   navigate("/trip-list");
        // }, 2000);
        fetchData();
        setViewTrip(true);
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const getCompany = async () => {
    const data = await getDocs(collection(db, "corporateCompany"));
    setCompanyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  let serialNumber = 1;

  const handleChangeEmployees = async (selectedValues) => {
    const selectedValuesArray = selectedValues.map((option) => option.value);

    const getSelectedEmployees = async () => {
      const querySnapshot = await Promise.all(
        selectedValuesArray.map(async (id) => {
          const docRef = doc(db, "corporateEmployees", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id };
          }
          return null;
        })
      );

      const selectedEmployees = querySnapshot
        .filter((employee) => employee !== null)
        .map((employee) => {
          const existingEmployee = SelectedEmployees.find(
            (prevEmployee) => prevEmployee.id === employee.id
          );
          if (existingEmployee) {
            return { ...existingEmployee };
          } else {
            return {
              ...employee,
              pickupLocation: "",
              pickupTime: "",
              dropLocation: "",
            };
          }
        });

      if (selectedEmployees) {
        const convertedEmployeeList = selectedEmployees.map((employee) => ({
          value: employee.id,
          label: employee.employeeId,
        }));
        setPreEmployeesList(convertedEmployeeList);
      } else {
        setPreEmployeesList([]);
      }
      setNoOfPickup(selectedEmployees.length);
      setSelectedEmployees(selectedEmployees);
    };

    getSelectedEmployees();
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    setSelectedEmployees((prevEmployees) => {
      const updatedEmployees = [...prevEmployees];
      const updatedEmployee = { ...updatedEmployees[index], [field]: value };
      updatedEmployees[index] = updatedEmployee;
      return updatedEmployees;
    });
  };

  const handleFormValidation = () => {
    let formIsValid = true;

    if (!RouteId) {
      formIsValid = false;
      setRouteIdError("Please enter route id");
    } else {
      setRouteIdError("");
    }
    if (!RouteName) {
      formIsValid = false;
      setRouteNameError("Please enter route name");
    } else {
      setRouteNameError("");
    }
    if (!TripDate) {
      formIsValid = false;
      setTripDateError("Please enter trip date");
    } else {
      setTripDateError("");
    }
    if (!ShiftTime) {
      formIsValid = false;
      setShiftTimeError("Please enter shift time");
    } else {
      setShiftTimeError("");
    }
    if (!FromLocation) {
      formIsValid = false;
      setFromLocationError("Please enter from location");
    } else {
      setFromLocationError("");
    }
    if (!ToLocation) {
      formIsValid = false;
      setToLocationError("Please enter to location");
    } else {
      setToLocationError("");
    }
    if (!PickupTime) {
      formIsValid = false;
      setPickupTimeError("Please enter pickup time");
    } else {
      setPickupTimeError("");
    }
    if (!TripType) {
      formIsValid = false;
      setTripTypeError("Please select trip type");
    } else {
      setTripTypeError("");
    }
    if (!VehicleType) {
      formIsValid = false;
      setVehicleTypeError("Please select vehicle type");
    } else {
      setVehicleTypeError("");
    }
    if (!NoOfPickup) {
      formIsValid = false;
      setNoOfPickupError("Please select atlest one pickup");
    } else {
      setNoOfPickupError("");
    }
    if (!CompanyId) {
      formIsValid = false;
      setCompanyIdError("Please select company");
    } else {
      setCompanyIdError("");
    }
    if (!TripAmount) {
      formIsValid = false;
      setTripAmountError("Please enter trip amount");
    } else {
      setTripAmountError("");
    }

    return formIsValid;
  };

  const handleEdit = () => {
    setViewTrip(false);
  };

  const getDriver = async () => {
    const data = await getDocs(collection(db, "Drivers"));
    setDriverList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDriverChange = async (event) => {
    const driverId = event.target.value;
    setSelectedDriver(driverId);

    try {
      const driverRef = doc(db, "Drivers", driverId);
      const driverSnapshot = await getDoc(driverRef);

      if (driverSnapshot.exists()) {
        const driverData = driverSnapshot.data();
        setDriverName(driverData.driverName);
        setDriverMobileNumber(driverData.mobileNo);
        setDriverVehicleType(driverData.vehicleType);
        setDriverVehicleNumber(driverData.vehicleNo);
        setDriverId(driverData.driverID);
      } else {
        console.log("Driver not found");
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };

  async function handleAllocateDriver() {
    setViewTrip(true);
    try {
      const tripRef = doc(db, "corporateTrips", id);
      const tripSnapshot = await getDoc(tripRef);

      if (!tripSnapshot.exists()) {
        console.error("Trip does not exist");
        return;
      }

      const referenceTrip = doc(db, "corporateTrips", id);
      await updateDoc(referenceTrip, {
        allocatedDriver: SelectedDriver,
        tripStatus: "Alloted",
      });
      setTripStatus("Alloted");

      const sortedSelectedEmployees = SelectedEmployees.sort((a, b) =>
        a.pickupTime.localeCompare(b.pickupTime)
      );

      // Create an array of promises for sending messages
      const employeePromises = sortedSelectedEmployees.map(async (employee) => {
        console.log("employee", employee);

        const parts = TripDate.split("-");
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        // const message = `*Chennai Cabs - Driver Details*\n\n*${employee.routeId} - ${employee.routeName} - ${employee.tripType}*\n\n*Driver ID:* ${DriverId}\n*Driver Name:* ${DriverName}\n*Driver No:* ${DriverMobileNumber}\n*Vehicle No:* ${DriverVehicleNumber}\n\n*CHENNAI CABS HELP LINE*\n1) AnnaDurai - Supervisor - 8939916568\n2) Saran - Site Incharge - 7358349442`;

        const message = `Dear ${employee.employeeName},

Greetings of the day! 🌞🌟

Here are the details for your Chennai Cabs trip on ${formattedDate}:

🚖 Trip Details:

Route ID: ${RouteId}
Route: ${RouteName}

🚗 Driver Information:

Driver ID: ${DriverId}
Driver Name: ${DriverName}
Driver Contact: ${DriverMobileNumber}
Vehicle Number: ${DriverVehicleNumber}

If you have any queries or require assistance during your trip, please feel free to contact our Chennai Cabs helpline:

📞 Chennai Cabs Help Line:
1️⃣ AnnaDurai - Supervisor - 8939916568
2️⃣ Saran - Site Incharge - 7358349442

Have a great trip! ✨🚖

Best regards,
Chennai Cabs`;

        try {
          await axios.get(
            `https://api.textmebot.com/send.php?recipient=+91${
              employee.mobileNo
            }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`
          );
          console.log(
            "Message sent successfully for employee:",
            employee.employeeId
          );
        } catch (error) {
          console.log(
            "Error sending message for employee:",
            employee.employeeId
          );
          console.log("Error:", error);
        }
      });

      const parts = TripDate.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      // Send message to the driver
      let driverMessage = "*Chennai Cabs - Employee Details:*\n";

      driverMessage += `\n*${RouteId} - ${RouteName} - ${TripType}*\n\n`;
      driverMessage += `*Trip date:* ${formattedDate}\n\n`;
      driverMessage += `*No. of Employees:* ${NoOfPickup}\n\n`;

      for (const employee of SelectedEmployees) {
        driverMessage += `*Employee Id:* ${employee.employeeId}\n`;
        driverMessage += `*Employee Name:* ${employee.employeeName}\n`;
        driverMessage += `*Mobile No:* ${employee.mobileNo}\n`;
        driverMessage += `*Pickup Location:* *${employee.pickupLocation}*\n`;
        driverMessage += `*Pickup Time:* ${employee.pickupTime}\n\n`;
      }

      // Remove trailing newline
      driverMessage = driverMessage.trimEnd();

      // Add the additional line
      driverMessage += "\n\n*CHENNAI CABS HELP LINE*\n";
      driverMessage += "1) AnnaDurai - Supervisor - 8939916568\n";
      driverMessage += "2) Saran - Site Incharge - 7358349442";

      try {
        await axios.get(
          `https://api.textmebot.com/send.php?recipient=+91${DriverMobileNumber}&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(
            driverMessage
          )}`
        );
        console.log("Message sent successfully to the driver.");
      } catch (error) {
        console.log("Error sending message to the driver.");
        console.log("Error:", error);
      }

      const supervisorMessage = `Chennai Cabs - Driver Details - [ ${formattedDate} ]

${RouteId} - ${RouteName} - ${TripType}

Driver ID: ${DriverId}
Driver Name: ${DriverName}
Driver Contact: ${DriverMobileNumber}
Vehicle Number: ${DriverVehicleNumber}`;

      if (CompanyId === "CVT2vw4klLuDV8Aksq2t") {
        const supervisorNumbers = ["8825981764", "9600114755", "9500166654"];

        const sendMessages = async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay for 5 seconds before the loop starts

          for (const number of supervisorNumbers) {
            try {
              await axios.get(
                `https://api.textmebot.com/send.php?recipient=+91${number}&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(
                  supervisorMessage
                )}`
              );
              console.log(`Message sent successfully to supervisor ${number}.`);
            } catch (error) {
              console.log(`Error sending message to supervisor ${number}.`);
              console.log("Error:", error);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Pause execution for 5 second between iterations
          }
          console.log("All messages sent successfully.");
        };

        sendMessages().catch((error) => {
          console.log("Error sending messages to supervisors.");
          console.log("Error:", error);
        });
      } else {
        console.log("CompanyId is not Lapiz. Message not sent to supervisors.");
      }

      if (CompanyId === "C1riMpDRib8Z8aa9Llez") {
        const supervisorNumbers = [
          "9962504088",
          "8939916568",
          "9600114755",
          "9500166654",
        ];

        const sendMessages = async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay for 5 seconds before the loop starts

          for (const number of supervisorNumbers) {
            try {
              await axios.get(
                `https://api.textmebot.com/send.php?recipient=+91${number}&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(
                  supervisorMessage
                )}`
              );
              console.log(`Message sent successfully to supervisor ${number}.`);
            } catch (error) {
              console.log(`Error sending message to supervisor ${number}.`);
              console.log("Error:", error);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Pause execution for 5 second between iterations
          }
          console.log("All messages sent successfully.");
        };

        sendMessages().catch((error) => {
          console.log("Error sending messages to supervisors.");
          console.log("Error:", error);
        });
      } else {
        console.log("CompanyId is not R1. Message not sent to supervisors.");
      }

      // Wait for all messages to be sent
      await Promise.all(employeePromises);

      console.log("All messages sent successfully");

      toast("Driver Allocated Successfully", {
        icon: "🚗",
        style: {
          borderRadius: "5px",
          background: "#1a1a1a",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          padding: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
        },
      });
    } catch (e) {
      console.error("Errors adding document: ", e);
    }
  }

  const handleDeleteTrip = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You are about to delete this route. This action cannot be undone!",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const docRef = doc(db, "corporateTrips", id);
      await deleteDoc(docRef);
      navigate("/trip-list");
    }
  };

  return (
    <Layout>
      <div>
        <Toaster />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center sm:mx-0">
            <div className="flex flex-row gap-4 ml-5  mt-3">
              <div className=" bg-[#ffffff] cursor-pointer drop-shadow-lg rounded-xl">
                <Link
                  to={"/trip-list"}
                  className="text-black w-10 h-10 flex justify-center items-center"
                >
                  <IoMdArrowRoundBack className="text-black w-6 h-6" />
                </Link>
              </div>

              <div
                className="p-2 bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400"
                onClick={handleDeleteTrip}
              >
                <RiDeleteBin6Line className="text-[#ff0000] w-6 h-6" />
              </div>
              {!ViewTrip || TripStatus === "Completed" ? null : (
                <Link to="#" onClick={handleEdit}>
                  <div className="p-2 bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400">
                    <FiEdit className="text-[#38e54d] w-6 h-6 " />
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 m-4">
            <div className="flex flex-col gap-1 md:flex-row md:gap-1">
              <div className="container mx-auto ">
                <div className="max-w-screen-md mx-auto border-2 bg-white shadow-lg rounded-lg px-8 py-6">
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 md:px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Route ID
                      </label>
                      <input
                        onChange={(e) => setRouteId(e.target.value)}
                        placeholder="Route ID"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={RouteId}
                        disabled={ViewTrip}
                      />
                      {RouteIdError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {RouteIdError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 md:px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        Route Name
                      </label>
                      <input
                        onChange={(e) => setRouteName(e.target.value)}
                        placeholder="Route Name"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={RouteName}
                        disabled={ViewTrip}
                      />
                      {RouteNameError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {RouteNameError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 md:px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Company
                      </label>
                      <select
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        // onChange={handleCompanyChange}
                        value={CompanyId}
                        id="company-name"
                        disabled
                      >
                        <option value="">--Select Company-- </option>
                        {CompanyList &&
                          CompanyList.map((company) => (
                            <option value={company.id} key={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                      </select>
                      {CompanyIdError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {CompanyIdError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 md:px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        Trip Amount
                      </label>
                      <input
                        onChange={(e) => setTripAmount(e.target.value)}
                        placeholder="Trip Amount"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={TripAmount}
                        disabled={ViewTrip}
                      />
                      {TripAmountError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {TripAmountError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 ">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Trip Date
                      </label>
                      <input
                        onChange={(e) => setTripDate(e.target.value)}
                        placeholder="Date"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="date"
                        value={TripDate}
                        disabled={ViewTrip}
                      />
                      {TripDateError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {TripDateError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        From Location
                      </label>
                      <input
                        onChange={(e) => setFromLocation(e.target.value)}
                        placeholder="From Location"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={FromLocation}
                        disabled={ViewTrip}
                      />
                      {FromLocationError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {FromLocationError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 ">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Pickup Time
                      </label>
                      <input
                        onChange={(e) => setPickupTime(e.target.value)}
                        placeholder="Pickup Time"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="time"
                        value={PickupTime}
                        disabled={ViewTrip}
                      />
                      {PickupTimeError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {PickupTimeError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        To Location
                      </label>
                      <input
                        onChange={(e) => setToLocation(e.target.value)}
                        placeholder="To Location"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={ToLocation}
                        disabled={ViewTrip}
                      />
                      {ToLocationError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {ToLocationError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 ">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Shift Time
                      </label>
                      <input
                        onChange={(e) => setShiftTime(e.target.value)}
                        placeholder="Shift Time"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="time"
                        value={ShiftTime}
                        disabled={ViewTrip}
                      />
                      {ShiftTimeError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {ShiftTimeError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        No Of Pickups
                      </label>
                      <input
                        placeholder="No of Pickups"
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        type="text"
                        value={NoOfPickup}
                        disabled
                      />
                      {NoOfPickupError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {NoOfPickupError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 ">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-first-name"
                      >
                        Trip Type
                      </label>
                      <select
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        id="grid-state"
                        value={TripType}
                        disabled={ViewTrip}
                      >
                        <option value="">--- Select Trip Type ---</option>
                        <option value="Drop">Drop</option>
                        <option value="Pickup">Pickup</option>
                      </select>
                      {TripTypeError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {TripTypeError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-last-name"
                      >
                        Vehicle Type
                      </label>
                      <select
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-[229px] bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                        id="vehicle-type"
                        value={VehicleType}
                        disabled={ViewTrip}
                      >
                        <option value="">--- Select Vehicle Type ---</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                      </select>
                      {VehicleTypeError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {VehicleTypeError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:-mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        for="grid-state"
                      >
                        Add Employees
                      </label>
                      <Select
                        className="w-full"
                        isMulti
                        value={PreEmployeesList}
                        onChange={handleChangeEmployees}
                        options={EmployeesList}
                        placeholder="---Select Employees---"
                        isDisabled={ViewTrip}
                      />
                    </div>
                  </div>
                  {ViewTrip ? null : (
                    <button
                      onClick={UpdateTrip}
                      className="bg-[#00adb5] rounded-lg py-3 px-2 text-white w-full hover:bg-[#00b5ad] active:bg-[#008080]"
                      type="submit"
                    >
                      Update Trip
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4  ">
                <div className="w-full md:w-[550px] h-auto border-2 bg-white shadow-lg rounded-lg mx-auto">
                  <div className="container p-8 h-auto">
                    <div className="flex flex-col md:flex-row -mx-2 mb-6">
                      <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                        <label
                          className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          htmlFor="grid-first-name"
                        >
                          Driver ID
                        </label>
                        <select
                          placeholder="Driver ID"
                          className="appearance-none block w-full md:w-[229px] focus:outline-none focus:bg-white focus:border-gray-500 bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
                          value={SelectedDriver}
                          onChange={handleDriverChange}
                          disabled={ViewTrip}
                        >
                          <option value="">--Select Driver--</option>
                          {DriverList &&
                            DriverList.map((driver) => (
                              <option value={driver.id} key={driver.id}>
                                {driver.driverID}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="w-full md:w-1/2 px-2 flex items-end justify-evenly">
                        {ViewTrip === true ? null : (
                          <button
                            type="submit"
                            className="bg-[#00adb5] text-white rounded py-3 px-8 text-sm font-bold md:text-base focus:border-[#4dd9e0] hover:bg-[#008c8f] active:bg-[#006d6f]"
                            onClick={handleAllocateDriver}
                          >
                            Allocate
                          </button>
                        )}
                      </div>
                    </div>

                    <AllocateDriver
                      DriverName={DriverName}
                      DriverMobileNumber={DriverMobileNumber}
                      DriverVehicleType={DriverVehicleType}
                      DriverVehicleNumber={DriverVehicleNumber}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <FetchTripStatus TripStatus={TripStatus} />
                </div>
                <div className="flex">
                  <DriverDetailsAlloted
                    DriverName={DriverName}
                    DriverVehicleType={DriverVehicleType}
                    DriverVehicleNumber={DriverVehicleNumber}
                    DriverId={DriverId}
                  />
                </div>
              </div>
            </div>
            <div className="w-full  ">
              <table className="border-collapse w-full mt-3">
                <thead className="bg-[#222831] justify-evenly items-center font-sans rounded-2xl ">
                  <tr>
                    <th className="p-3 mb-2 text-center text-white rounded-l-xl">
                      Sl.No
                    </th>
                    <th className="text-center text-white">Employee ID</th>
                    <th className="text-center text-white">Employee Name</th>
                    <th className="text-center text-white">Gender</th>
                    <th className="text-center text-white">Contact Number</th>
                    <th className="text-center text-white">Pickup Location</th>
                    <th className="text-center text-white">Pickup Time</th>
                    <th className="text-center text-white rounded-r-xl">
                      Drop Location
                    </th>
                  </tr>
                </thead>

                {SelectedEmployees.length > 0 && (
                  <tbody className="table-row-group p-4 text-lg divide-x-0  uppercase rounded-md">
                    {SelectedEmployees.map((row, index) => {
                      return (
                        <tr
                          className="  rounded-lg drop-shadow-2xl text-center justify-center  shadow-lg  table-row  align-middle  outline-none     "
                          tabIndex={-1}
                          // key={}
                        >
                          <td className="  text-[#393e46]  text-left  font-medium text-sm font-sans">
                            <span className="text-[#393e46]">
                              {serialNumber++}
                            </span>
                          </td>
                          <td className="  text-[#393e46]  text-left  font-medium text-sm font-sans">
                            <span className="text-[#393e46]">
                              {row.employeeId}
                            </span>
                          </td>
                          <td className=" py-3 text-[#393e46]  text-left  font-medium text-sm font-sans">
                            <span className="text-[#393e46]">
                              {row.employeeName}
                            </span>
                          </td>
                          <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                            <span className="text-[#393e46]">{row.gender}</span>
                          </td>
                          <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                            <span className="text-[#393e46]">
                              {row.mobileNo}
                            </span>
                          </td>
                          <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                            <input
                              type="text"
                              placeholder="Enter Pickup Location"
                              className="w-full text-[#393E46]  mr-2 mt-2 mb-2  font-medium text-sm font-sans p-2 border-2 border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#393E46]"
                              value={row.pickupLocation}
                              onChange={(e) =>
                                handleInputChange(e, index, "pickupLocation")
                              }
                              disabled={ViewTrip}
                            />
                          </td>
                          <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                            <input
                              type="time"
                              placeholder="Enter Pickup Time"
                              className="w-full text-[#393E46]  mr-2 mt-2 mb-2  font-medium text-sm font-sans p-2 border-2 border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#393E46]"
                              value={row.pickupTime}
                              onChange={(e) =>
                                handleInputChange(e, index, "pickupTime")
                              }
                              disabled={ViewTrip}
                            />
                          </td>
                          <td className="py-3 text-[#393e46] text-center font-medium text-sm font-sans">
                            <input
                              type="text"
                              placeholder="Enter Drop Location"
                              className="w-full text-[#393E46] mr-2 mt-2 mb-2 font-medium text-sm font-sans p-2 border-2 border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#393E46]"
                              value={row.dropLocation}
                              onChange={(e) =>
                                handleInputChange(e, index, "dropLocation")
                              }
                              disabled={ViewTrip}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
