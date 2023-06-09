import { useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { MdOutlineContentCopy } from "react-icons/md";
import TripCopy from "../TripManagement/TripCopy";
import UpdateTripStatus from "../TripManagement/UpdateTripStatus";
import { Toaster, toast } from "react-hot-toast";

export default function TripList({ rows, getTrips }) {
  const [RouteId, setRouteId] = useState("");
  const [TripDate, setTripDate] = useState("");
  const [RouteName, setRouteName] = useState("");
  const [ShiftTime, setShiftTime] = useState("");
  const [TripType, setTripType] = useState("");
  const [VehicleType, setVehicleType] = useState("");
  const [FromLocation, setFromLocation] = useState("");
  const [ToLocation, setToLocation] = useState("");
  const [PickupTime, setPickupTime] = useState("");
  const [NoOfPickup, setNoOfPickup] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [TripAmount, setTripAmount] = useState("");
  const [NoOfEmployeePicked, setNoOfEmployeePicked] = useState("");
  const [TripEndTime, setTripEndTime] = useState("");
  const [SelectedId, setSelectedId] = useState("");
  const [SelectedEmployees, setSelectedEmployees] = useState([]);
  const [TripCompleted, setTripCompleted] = useState(false);

  const [TripDateError, setTripDateError] = useState("");
  const [RouteIdError, setRouteIdError] = useState("");
  const [RouteNameError, setRouteNameError] = useState("");
  const [ShiftTimeError, setShiftTimeError] = useState("");
  const [TripTypeError, setTripTypeError] = useState("");
  const [VehicleTypeError, setVehicleTypeError] = useState("");
  const [NoOfEmployeePickedError, setNoOfEmployeePickedError] = useState("");
  const [TripEndTimeError, setTripEndTimeError] = useState("");

  const [showMyModal, setShowMyModal] = useState(false);
  const handleOnClose = () => setShowMyModal(false);

  const [showMyStatusModal, setShowMyStatusModal] = useState(false);
  const handleOnCloseStatus = () => setShowMyStatusModal(false);

  const handleClick = async (id) => {
    setShowMyModal(true);

    try {
      const tripDocRef = doc(db, "corporateTrips", id);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data();
        const selectedEmployeesSnapshot = await getDocs(
          collection(db, "corporateTrips", id, "selectedEmployees")
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
        setTripType(tripWithSelectedEmployees.tripType);
        setTripDate(tripWithSelectedEmployees.tripDate);
        setShiftTime(tripWithSelectedEmployees.shiftTime);
        setVehicleType(tripWithSelectedEmployees.vehicleType);
        setFromLocation(tripWithSelectedEmployees.fromLocation);
        setToLocation(tripWithSelectedEmployees.toLocation);
        setPickupTime(tripWithSelectedEmployees.pickupTime);
        setNoOfPickup(tripWithSelectedEmployees.noOfPickup);
        setCompanyId(tripWithSelectedEmployees.companyId);
        setTripAmount(tripWithSelectedEmployees.tripAmount);
        setSelectedEmployees(tripWithSelectedEmployees.selectedEmployees);
      } else {
        console.log("Trip not found");
      }
    } catch (error) {
      console.error("Error getting trip:", error);
    }
  };

  const handleClickStatus = async (id) => {
    setShowMyStatusModal(true);
    setSelectedId(id);

    try {
      const tripDocRef = doc(db, "corporateTrips", id);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data();
        const selectedEmployeesSnapshot = await getDocs(
          collection(db, "corporateTrips", id, "selectedEmployees")
        );
        const selectedEmployeesData = selectedEmployeesSnapshot.docs.map(
          (doc) => doc.data()
        );

        const tripWithSelectedEmployees = {
          id: tripSnapshot.id,
          ...tripData,
          selectedEmployees: selectedEmployeesData,
        };

        setNoOfEmployeePicked(tripWithSelectedEmployees.noOfEmployeePicked);
        setTripEndTime(tripWithSelectedEmployees.tripEndTime);
        setRouteId(tripWithSelectedEmployees.routeId);
        setRouteName(tripWithSelectedEmployees.routeName);
        setTripType(tripWithSelectedEmployees.tripType);
        setTripCompleted(
          tripWithSelectedEmployees.tripStatus === "Completed" ? true : false
        );
      } else {
        console.log("Trip not found");
      }
    } catch (error) {
      console.error("Error getting trip:", error);
    }
  };

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
          vehicleType: NoOfEmployeePicked,
          NoOfEmployeePickedp: NoOfPickup,
          tripStatus: "Not Alloted",
          createdAt: new Date().toISOString(),
        });

        const selectedEmployeesCollectionRef = collection(
          newTripDocRef,
          "selectedEmployees"
        );

        for (const employee of SelectedEmployees) {
          await addDoc(selectedEmployeesCollectionRef, employee);
        }

        handleOnClose();
        getTrips();

        toast("Copy Trip Created Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    if (handleStatusFormValidation()) {
      try {
        const tripRef = doc(db, "corporateTrips", SelectedId);
        const tripSnapshot = await getDoc(tripRef);

        if (!tripSnapshot.exists()) {
          console.error("Trip does not exist");
          return;
        }

        const referenceTrip = doc(db, "corporateTrips", SelectedId);
        await updateDoc(referenceTrip, {
          noOfEmployeePicked: NoOfEmployeePicked,
          tripEndTime: TripEndTime,
          tripStatus: "Completed",
        });

        handleOnCloseStatus();
        getTrips();

        toast("Status Updated Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const handleFormValidation = () => {
    let formIsValid = true;

    if (!TripDate) {
      formIsValid = false;
      setTripDateError("Please enter trip date");
    } else {
      setTripDateError("");
    }
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
    if (!ShiftTime) {
      formIsValid = false;
      setShiftTimeError("Please select shift time");
    } else {
      setShiftTimeError("");
    }
    if (!TripType) {
      formIsValid = false;
      setTripTypeError("Please select trip type");
    } else {
      setTripTypeError("");
    }
    if (!NoOfEmployeePicked) {
      NoOfEmployeePicked = false;
      setVehicleTypeError("Please select vehicle type");
    } else {
      setVehicleTypeError("");
    }

    return formIsValid;
  };

  const handleStatusFormValidation = () => {
    let formIsValid = true;

    if (!NoOfEmployeePicked) {
      formIsValid = false;
      setNoOfEmployeePickedError("Please enter no of employee picked");
    } else {
      setNoOfEmployeePickedError("");
    }

    if (!TripEndTime) {
      formIsValid = false;
      setTripEndTimeError("Please enter trip end time");
    } else {
      setTripEndTimeError("");
    }
    return formIsValid;
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-6 m-2 mt-4 bg-white rounded-lg shadow-lg ">
          <table className="border-collapse">
            <thead className="bg-[#222831] justify-evenly items-center font-sans rounded-2xl table-row">
              <th className="text-center p-4  text-white rounded-l-xl">
                Route ID
              </th>
              <th className="text-center text-white ">Date</th>
              <th className="text-center text-white">Route Name</th>
              <th className="text-center text-white">Shift Time</th>
              <th className="text-center text-white">Trip Type</th>
              <th className="text-center text-white">Vehicle Type</th>
              <th className="text-center text-white ">No. of Emp</th>
              <th className="text-center text-white ">Status</th>
              <th className="text-center text-white rounded-r-xl">Copy</th>
            </thead>
            {rows && rows.length > 0 ? (
              <tbody className="table-row-group p-4 text-lg uppercase divide-x-0 rounded-md">
                {rows.map((row) => {
                  return (
                    <tr
                      className="justify-center table-row text-center align-middle rounded-lg shadow-lg outline-none drop-shadow-2xl"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <td>
                        <Link to={`/view-trip/${row.id}`}>
                          <div className="  text-[#393e46] text-center m-2 cursor-pointer font-medium text-sm font-sans hover:transform hover:scale-125 hover:font-base transition duration-300 ease-in-out">
                            <span class="  text-center text-sm font-sans text-[#323EDD]  cursor-pointer font-semibold  ">
                              {row.routeId}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3  text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">{row.tripDate}</span>
                      </td>
                      <td className="  text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">{row.routeName}</span>
                      </td>
                      <td className="  text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">{row.shiftTime}</span>
                      </td>
                      <td className="  text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">{row.tripType}</span>
                      </td>
                      <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">
                          {row.vehicleType}
                        </span>
                      </td>
                      <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                        <span className="text-[#393e46]">{row.noOfPickup}</span>
                      </td>
                      <td className=" p-3  text-[#393e46] text-center  font-medium text-sm font-sans pl-6">
                        <span className=" flex flex-row gap-1 relative cursor-pointer">
                          {/* <MdBrightnessHigh
                            onClick={() => tripStatus(row.id)}
                            className="cursor-pointer text-xl hover:text-red-600"
                          /> */}

                          <div
                            className={
                              row.tripStatus === "Alloted"
                                ? "text-[#ff8103] text-base font-sans  "
                                : row.tripStatus === "Not Alloted"
                                ? "text-[#31007a] text-base font-sans  "
                                : row.tripStatus === "Ongoing"
                                ? "text-[#e8d100] text-base font-sans  "
                                : "text-[#2daa00] text-base font-sans  "
                            }
                            onClick={() => handleClickStatus(row.id)}
                          >
                            {" "}
                            {row.tripStatus}
                          </div>
                        </span>
                      </td>

                      <td className="py-3 text-[#393e46] text-center font-medium text-sm font-sans">
                        <div
                          className="text-[#393e46] text-center m-2 cursor-pointer font-medium text-sm font-sans hover:transform hover:scale-125 hover:font-base transition duration-300 ease-in-out"
                          onClick={() => handleClick(row.id)}
                        >
                          <MdOutlineContentCopy className="cursor-pointer text-xl hover:text-red-600" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody className="table-row-group p-4 text-lg uppercase divide-x-0 rounded-md">
                <tr
                  className="justify-center table-row text-center align-middle rounded-lg shadow-lg outline-none drop-shadow-2xl"
                  tabIndex={-1}
                >
                  <td
                    colSpan="9"
                    className="text-[#393e46] text-center font-medium text-sm font-sans"
                  >
                    No record found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      <TripCopy
        onClose={handleOnClose}
        visible={showMyModal}
        handleSubmit={handleSubmit}
        getTrips={getTrips}
        getRouteId={RouteId}
        getTripDate={TripDate}
        getRouteName={RouteName}
        getShiftTime={ShiftTime}
        getTripType={TripType}
        getVehicleType={VehicleType}
        setRouteId={setRouteId}
        setTripDate={setTripDate}
        setRouteName={setRouteName}
        setShiftTime={setShiftTime}
        setTripType={setTripType}
        setVehicleType={setVehicleType}
        TripDateError={TripDateError}
        RouteIdError={RouteIdError}
        RouteNameError={RouteNameError}
        ShiftTimeError={ShiftTimeError}
        TripTypeError={TripTypeError}
        VehicleTypeError={VehicleTypeError}
      />
      <UpdateTripStatus
        onClose={handleOnCloseStatus}
        visible={showMyStatusModal}
        handleSubmit={handleSubmitStatus}
        NoOfEmployeePicked={NoOfEmployeePicked}
        TripEndTime={TripEndTime}
        setNoOfEmployeePicked={setNoOfEmployeePicked}
        setTripEndTime={setTripEndTime}
        NoOfEmployeePickedError={NoOfEmployeePickedError}
        TripEndTimeError={TripEndTimeError}
        TripCompleted={TripCompleted}
        TripType={TripType}
        RouteName={RouteName}
        RouteId={RouteId}
      />
    </>
  );
}
