import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Select from "react-select";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import backButton from "../../assets/Icons/IconsForPages/backArrow.png";
import Layout from "../../Layout/Layout";

export default function AddEditTrip() {
  const { id } = useParams();
  const pageTitle = id ? "Copy Trip" : "Create Trip";

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
  const [EmployeesList, setEmployeesList] = useState([]);
  const [SelectedEmployees, setSelectedEmployees] = useState([]);
  const [PreEmployeesList, setPreEmployeesList] = useState([]);

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

    getCompany();

    await fetchEmployeesByCompanyId(CompanyId);
  };

  useEffect(() => {
    fetchData();
  }, [CompanyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        const tripsCollectionRef = collection(db, "corporateTrips");
        const newTripDocRef = await addDoc(tripsCollectionRef, {
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
          tripStatus: "Not Alloted",
          createdAt: new Date().toISOString(),
        });

        // Sort SelectedEmployees based on pickupTime in ascending order
        const sortedSelectedEmployees = SelectedEmployees.sort((a, b) =>
          a.pickupTime.localeCompare(b.pickupTime)
        );

        const selectedEmployeesCollectionRef = collection(
          newTripDocRef,
          "selectedEmployees"
        );

        for (const employee of sortedSelectedEmployees) {
          await addDoc(selectedEmployeesCollectionRef, employee);
        }

        toast("New Trip Created Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/trip-list");
        }, 2000);
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const getCompany = async () => {
    const data = await getDocs(collection(db, "corporateCompany"));
    setCompanyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getEmployeesByCompanyId = async (companyId) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "corporateEmployees"),
        where("companyId", "==", companyId)
      )
    );

    const employeesList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return employeesList;
  };

  const handleCompanyChange = async (e) => {
    const selectedCompanyId = e.target.value;
    setCompanyId(selectedCompanyId);

    if (selectedCompanyId) {
      const employees = await getEmployeesByCompanyId(selectedCompanyId);
      const convertedEmployeeList = employees.map((employee) => ({
        value: employee.id,
        label: employee.employeeId,
      }));
      setEmployeesList(convertedEmployeeList);
    } else {
      setEmployeesList([]);
    }
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

  return (
    <>
      <Layout>
        <Toaster />
        <div className="p-5">
          <div className='"w-full max-w-lg"'>
            <div className="bg-white rounded-md drop-shadow-lg">
              <div className="container">
                <div className="flex flex-wrap w-full ">
                  <div className="flex items-center justify-between w-full pr-12">
                    <div className="m-8  bg-[#ffffff] cursor-pointer drop-shadow-lg rounded-xl">
                      <Link
                        to={"/trip-list"}
                        className="flex items-center justify-center  w-10 h-10 text-white"
                      >
                        <img
                          src={backButton}
                          className="w-5"
                          alt=""
                          srcset=""
                        />
                      </Link>
                    </div>
                    <div className="content-center m-8 text-center ">
                      <h1 className="font-bold text-[25px] text-black pr-4 justify-center text-center">
                        {pageTitle}
                      </h1>
                    </div>
                    <div>
                      <button
                        className="flex items-center justify-center w-full"
                        onClick={handleSubmit} // Add the onClick event handler
                      >
                        <Link
                          // to="/view-employee" // Specify the desired route for the Link component
                          className="bg-[#00adb5] hover:bg-[#059299] active:bg-[#047481] text-gray-100 text-xl font-bold w-full text-center pl-2 pr-2 p-1 rounded-lg my-6"
                        >
                          Submit
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="container h-auto px-6 py-0">
                  <div className="container h-auto ">
                    <div class="flex flex-wrap -mx-3 ">
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-state"
                        >
                          Route ID
                        </label>
                        <input
                          placeholder="Enter Route ID"
                          class="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          onChange={(e) => setRouteId(e.target.value)}
                          value={RouteId}
                        />
                        {RouteIdError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {RouteIdError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-company"
                        >
                          Company
                        </label>
                        <select
                          className="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] rounded-lg py-3 px-4 leading-tight focus:border-[#393E46] focus:outline-none focus:bg-white"
                          onChange={handleCompanyChange}
                          value={CompanyId}
                          id="company-name"
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
                          <p className="mt-1 text-sm text-red-500 ">
                            {CompanyIdError}
                          </p>
                        )}
                      </div>

                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-tripAmount"
                        >
                          Trip Amount
                        </label>
                        <input
                          placeholder="Enter Trip Amount"
                          class="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="number"
                          onChange={(e) => setTripAmount(e.target.value)}
                          value={TripAmount}
                        />
                        {TripAmountError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {TripAmountError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 ">
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-city"
                        >
                          Route Name
                        </label>
                        <input
                          placeholder="Enter Route Name"
                          class="w-full font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          onChange={(e) => setRouteName(e.target.value)}
                          value={RouteName}
                        />
                        {RouteNameError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {RouteNameError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-zip"
                        >
                          Trip Date
                        </label>
                        <input
                          placeholder="Enter Trip Date"
                          class="w-full font-sans font-medium text-base text-[#393E46] bg-white  border-2  border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          onChange={(e) => setTripDate(e.target.value)}
                          value={TripDate}
                        />
                        {TripDateError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {TripDateError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-state"
                        >
                          Shift Time
                        </label>
                        <input
                          placeholder="Enter Shift Time"
                          class="w-full font-sans font-medium text-base text-[#393E46] bg-white  border-2  border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="time"
                          onChange={(e) => setShiftTime(e.target.value)}
                          value={ShiftTime}
                        />
                        {ShiftTimeError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {ShiftTimeError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-city"
                        >
                          From Location
                        </label>
                        <input
                          placeholder="Enter From Location"
                          class="w-full font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          onChange={(e) => setFromLocation(e.target.value)}
                          value={FromLocation}
                        />
                        {FromLocationError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {FromLocationError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-zip"
                        >
                          To Location
                        </label>
                        <input
                          placeholder="Enter To Location"
                          class="w-full font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          onChange={(e) => setToLocation(e.target.value)}
                          value={ToLocation}
                        />
                        {ToLocationError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {ToLocationError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-state"
                        >
                          Pickup Time
                        </label>
                        <input
                          placeholder="Enter Pickup Time"
                          class="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="time"
                          onChange={(e) => setPickupTime(e.target.value)}
                          value={PickupTime}
                        />
                        {PickupTimeError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {PickupTimeError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-city"
                        >
                          Trip Type
                        </label>
                        <select
                          onChange={(e) => setTripType(e.target.value)}
                          class="block appearance-none w-full bg-white border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] rounded-lg text-[#393E46] font-sans font-medium py-3 px-4 pr-8 leading-tight focus:outline-none"
                          id="grid-state"
                          value={TripType}
                        >
                          <option value="">--- Select Trip Type ---</option>
                          <option value="Drop">Drop</option>
                          <option value="Pickup">Pickup</option>
                        </select>
                        {TripTypeError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {TripTypeError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-zip"
                        >
                          Vehicle Type
                        </label>
                        <select
                          onChange={(e) => setVehicleType(e.target.value)}
                          class="block appearance-none w-full bg-white  border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] rounded-lg text-[#393E46] font-sans font-medium py-3 px-4 pr-8 leading-tight focus:outline-none"
                          value={VehicleType}
                        >
                          <option value="">--- Select Vehicle Type ---</option>
                          <option value="SUV">SUV</option>
                          <option value="Sedan">Sedan</option>
                          <option value="Hatchback">Hatchback</option>
                        </select>
                        {VehicleTypeError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {VehicleTypeError}
                          </p>
                        )}
                      </div>
                      <div class="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-state"
                        >
                          No of Pickup
                        </label>
                        <input
                          placeholder="Enter Number of Pickup"
                          class="w-full font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          value={NoOfPickup}
                          disabled
                        />
                        {NoOfPickupError && (
                          <p className="mt-1 text-sm text-red-500 ">
                            {NoOfPickupError}
                          </p>
                        )}
                      </div>
                      <div className="w-1/3 p-2">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                          for="grid-state"
                        >
                          Add Employees
                        </label>
                        <Select
                          className="w-full"
                          isMulti
                          onChange={handleChangeEmployees}
                          options={EmployeesList}
                          placeholder="---Select Employees---"
                        />
                      </div>
                    </div>
                    <div className="w-full  ">
                      <table className="w-full mt-3 border-collapse">
                        <thead className="bg-[#222831] justify-evenly items-center font-sans rounded-2xl ">
                          <tr>
                            <th className="p-3 mb-2 text-center text-white rounded-l-xl">
                              Sl.No
                            </th>
                            <th className="text-center text-white">
                              Employee ID
                            </th>
                            <th className="text-center text-white">
                              Employee Name
                            </th>
                            <th className="text-center text-white">Gender</th>
                            <th className="text-center text-white">
                              Contact Number
                            </th>
                            <th className="text-center text-white">
                              Pickup Location
                            </th>
                            <th className="text-center text-white">
                              Pickup Time
                            </th>
                            <th className="text-center text-white rounded-r-xl">
                              Drop Location
                            </th>
                          </tr>
                        </thead>

                        {SelectedEmployees.length > 0 && (
                          <tbody className="table-row-group p-4 text-lg uppercase divide-x-0 rounded-md">
                            {SelectedEmployees.map((row, index) => {
                              return (
                                <tr
                                  className="justify-center table-row text-center align-middle rounded-lg shadow-lg outline-none drop-shadow-2xl"
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
                                    <span className="text-[#393e46]">
                                      {row.gender}
                                    </span>
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
                                      value={row.pickupLocation} // Set the initial value from the array
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          index,
                                          "pickupLocation"
                                        )
                                      } // Call the event handler
                                    />
                                  </td>
                                  <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                                    <input
                                      type="time"
                                      placeholder="Enter Pickup Time"
                                      className="w-full text-[#393E46]  mr-2 mt-2 mb-2  font-medium text-sm font-sans p-2 border-2 border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#393E46]"
                                      value={row.pickupTime} // Set the initial value from the array
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          index,
                                          "pickupTime"
                                        )
                                      } // Call the event handler
                                    />
                                  </td>
                                  <td className="py-3 text-[#393e46] text-center font-medium text-sm font-sans">
                                    <input
                                      type="text"
                                      placeholder="Enter Drop Location"
                                      className="w-full text-[#393E46] mr-2 mt-2 mb-2 font-medium text-sm font-sans p-2 border-2 border-[#D6D6D6] rounded-lg focus:outline-none focus:border-[#393E46]"
                                      value={row.dropLocation}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          index,
                                          "dropLocation"
                                        )
                                      }
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
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
