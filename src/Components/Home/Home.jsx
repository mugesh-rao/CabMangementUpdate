import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, query, getDocs, where } from "firebase/firestore";
import HomeTripData from "../Home/HomeTripData";
import { TodayTripChart } from "../Home/TodayTripChart";
import { WeeklyBarChart } from "../Home/WeeklyBarChart";
import TripList from "../TripManagement/TripList";
import Layout from "../../Layout/Layout";

function Home() {
  const location = useLocation();
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalNotAllocated, setTotalNotAllocated] = useState(0);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);
  const [totalOngoing, setTotalOngoing] = useState(0);
  const [rows, setRows] = useState([]);
  const [weeklyTrips, setWeeklyTrips] = useState([]);
  const [lastSevenDaysOfWeek, setLastSevenDaysOfWeek] = useState([]);

  const [fromDate, setFromDate] = useState(
    localStorage.getItem("fromDate") || null
  );
  const [toDate, setToDate] = useState(localStorage.getItem("toDate") || null);

  const [fromHomeDate, setFromHomeDate] = useState(
    localStorage.getItem("fromHomeDate") || null
  );
  const [toHomeDate, setToHomeDate] = useState(
    localStorage.getItem("toHomeDate") || null
  );

  const [tripType, setTripType] = useState(
    localStorage.getItem("tripType") || ""
  );
  const [vehicleType, setVehicleType] = useState(
    localStorage.getItem("vehicleType") || ""
  );

  const handleDateChange = (e) => {
    if (e.target.id === "from") {
      setFromDate(e.target.value);
      localStorage.setItem("fromDate", e.target.value);
    } else {
      setToDate(e.target.value);
      localStorage.setItem("toDate", e.target.value);
    }
  };

  const handleHomeDateChange = (e) => {
    if (e.target.id === "fromHome") {
      setFromHomeDate(e.target.value);
      localStorage.setItem("fromHomeDate", e.target.value);
    } else {
      setToHomeDate(e.target.value);
      localStorage.setItem("toHomeDate", e.target.value);
    }
  };

  const handleVehicleTypeChange = (e) => {
    setVehicleType(e.target.value);
    localStorage.setItem("vehicleType", e.target.value);
  };

  const handleTripTypeChange = (e) => {
    setTripType(e.target.value);
    localStorage.setItem("tripType", e.target.value);
  };

  // Clear localStorage on page refresh
  window.onbeforeunload = () => {
    localStorage.removeItem('vehicleType');
    localStorage.removeItem('tripType');
    localStorage.removeItem('toHomeDate');
    localStorage.removeItem('fromHomeDate');
    localStorage.removeItem('toDate');
    localStorage.removeItem('fromDate');
  };
  

  const getWeeklyChartData = async () => {
    const currentDate = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const tripsArray = []; // Array to store trips for the last 7 weekdays
    const tripsLengthArray = []; // Array to store the lengths of the trips for the last 7 weekdays

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);

      const indianDate = date
        .toLocaleString("en-IN", options)
        .split("/")
        .reverse()
        .join("-");

      let q = query(
        collection(db, "corporateTrips"),
        where("tripDate", "==", indianDate)
      );

      const querySnapshot = await getDocs(q);
      const tripsCount = querySnapshot.docs.length;

      tripsArray.push(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );

      tripsLengthArray.push(tripsCount);
    }
    setWeeklyTrips(tripsLengthArray.reverse());

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayIndex = new Date().getDay();

    const lastSevenDays = [];
    let count = 0;

    while (lastSevenDays.length < 7) {
      const weekdayIndex = (currentDayIndex - count + 7) % 7;
      lastSevenDays.unshift(weekdays[weekdayIndex]);
      count++;
    }

    setLastSevenDaysOfWeek(lastSevenDays);
  };

  const chartTripsData = async () => {
    let q = query(collection(db, "corporateTrips"));

    // Add condition to retrieve trips between fromDate and toDate
    if (fromHomeDate && toHomeDate) {
      q = query(
        q,
        where("tripDate", ">=", fromHomeDate),
        where("tripDate", "<=", toHomeDate)
      );
    } else {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      const indianDate = currentDate
        .toLocaleString("en-IN", options)
        .split("/")
        .reverse()
        .join("-");

      q = query(q, where("tripDate", "==", indianDate));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const filteredNotAllocatedData = data.filter(
      (obj) => obj.tripStatus === "Not Alloted"
    );
    const filteredAllocatedData = data.filter(
      (obj) => obj.tripStatus === "Alloted"
    );
    const filteredCompletedData = data.filter(
      (obj) => obj.tripStatus === "Completed"
    );
    const filteredCancelledData = data.filter(
      (obj) => obj.tripStatus === "Cancelled"
    );
    const filteredOngoingData = data.filter(
      (obj) => obj.tripStatus === "Ongoing"
    );

    setTotalAllocated(filteredAllocatedData.length);
    setTotalNotAllocated(filteredNotAllocatedData.length);
    setTotalCompleted(filteredCompletedData.length);
    setTotalCancelled(filteredCancelledData.length);
    setTotalOngoing(filteredOngoingData.length);
    setTotalTrips(data.length);
  };

  useEffect(() => {
    if (location.pathname === "/trip-list") {
      getTrips();
    }
    if (location.pathname === "/home") {
      getHomeTrips();
    }

    chartTripsData();
  }, [
    vehicleType,
    tripType,
    fromDate,
    toDate,
    location,
    fromHomeDate,
    toHomeDate,
  ]);

  useEffect(() => {
    getWeeklyChartData();
  }, []);

  const getTrips = async () => {
    let q = query(collection(db, "corporateTrips"));

    if (vehicleType !== "") {
      q = query(q, where("vehicleType", "==", vehicleType));
    }

    if (tripType !== "") {
      q = query(q, where("tripType", "==", tripType));
    }

    // Add condition to retrieve trips between fromDate and toDate
    if (fromDate && toDate) {
      q = query(
        q,
        where("tripDate", ">=", fromDate),
        where("tripDate", "<=", toDate)
      );
    } else {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      const indianDate = currentDate
        .toLocaleString("en-IN", options)
        .split("/")
        .reverse()
        .join("-");

      q = query(q, where("tripDate", "==", indianDate));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setRows(data);
  };

  const getHomeTrips = async () => {
    let q = query(collection(db, "corporateTrips"));

    // Add condition to retrieve trips between fromDate and toDate
    if (fromHomeDate && toHomeDate) {
      q = query(
        q,
        where("tripDate", ">=", fromHomeDate),
        where("tripDate", "<=", toHomeDate)
      );
    } else {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      const indianDate = currentDate
        .toLocaleString("en-IN", options)
        .split("/")
        .reverse()
        .join("-");

      q = query(q, where("tripDate", "==", indianDate));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setRows(data);
  };

  const hideChart = location.pathname === "/trip-list";
  const hideSearchBar = location.pathname === "/home";

  return (
    <>
      <Layout>
        <div className="flex flex-col md:flex-row md:gap-3">
          {!hideChart && (
            <>
              <div className="w-full md:w-[420px] border-1 shadow-lg bg-white p-2 m-1 rounded-xl">
                <TodayTripChart
                  totalAllocated={totalAllocated}
                  totalNotAllocated={totalNotAllocated}
                  totalCompleted={totalCompleted}
                  totalTrips={totalTrips}
                  totalCancelled={totalCancelled}
                  totalOngoing={totalOngoing}
                />
              </div>
              <div className="w-full md:w-[572px] border-1 shadow-lg bg-white p-2 rounded-xl mt-2 md:mt-0">
                <div className="py-6 item-center flex flex-col justify-center items-center gap-8">
                  <WeeklyBarChart
                    weeklyTrips={weeklyTrips}
                    lastSevenDaysOfWeek={lastSevenDaysOfWeek}
                  />
                </div>
              </div>
              <div className="w-full md:w-[380px] border-1 shadow-lg bg-white p-2 rounded-xl mt-2">
                <div className="flex flex-col p-2 gap-2 ">
                  <div className="flex flex-row gap-2 items-center">
                    <label
                      htmlFor="from"
                      className="font-medium text-lg text-[#222831] font-sans "
                    >
                      From
                    </label>
                    <input
                      className="appearance-none block w-full text-gray-700 border-gray-600 border-2 rounded-lg py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="date"
                      id="fromHome"
                      onChange={handleHomeDateChange}
                      value={fromHomeDate}
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center mt-2">
                    <input
                      className="appearance-none block w-full text-gray-700 border-gray-600 border-2 rounded-lg py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="date"
                      id="toHome"
                      onChange={handleHomeDateChange}
                      value={toHomeDate}
                    />
                    <label className="font-medium text-lg font-sans cursor-pointer">
                      To
                    </label>
                  </div>
                </div>
                <HomeTripData
                  totalAllocated={totalAllocated}
                  totalNotAllocated={totalNotAllocated}
                  totalCompleted={totalCompleted}
                  totalTrips={totalTrips}
                />
              </div>
            </>
          )}
        </div>

        <div>
          {!hideSearchBar && (
            <div className="flex flex-col justify-between px-4 py-3 mx-0 mt-2 bg-white border-2 md:flex-row border-1 rounded-xl">
              <form className="flex items-center justify-between w-full pl-1 pr-1 font-sans">
                <div className="flex items-center justify-center mb-2">
                  <label
                    htmlFor="project"
                    className="mr-2 text-sm font-bold text-gray-900 "
                  >
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    onChange={handleVehicleTypeChange}
                    className="border-2 text-center text-sm rounded-lg p-2 bg-[#F0F0F0] border-[#D6D6D6]"
                    value={vehicleType}
                    required
                  >
                    <option className="p-1" value="">
                      All Vehicle
                    </option>
                    <option className="p-1" value="Sedan">
                      Sedan
                    </option>
                    <option className="p-1" value="SUV">
                      SUV
                    </option>
                    <option className="p-1" value="Hatchback">
                      Hatchback
                    </option>
                  </select>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <label
                    htmlFor="project"
                    className="mr-2 text-sm font-bold text-gray-900 "
                  >
                    Trip type
                  </label>
                  <select
                    id="tripType"
                    onChange={handleTripTypeChange}
                    className="border-2 text-center text-sm rounded-lg p-2 bg-[#F0F0F0] border-[#D6D6D6]"
                    value={tripType}
                    required
                    placeholder="Select trip type"
                  >
                    <option className="p-1" value="">
                      All trip type
                    </option>
                    <option className="p-1" value="Pickup">
                      Pickup
                    </option>
                    <option className="p-1" value="Drop">
                      Drop
                    </option>
                  </select>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <label
                    htmlFor="from"
                    className="mr-2 text-sm font-bold text-gray-900 "
                  >
                    From
                  </label>
                  <input
                    type="date"
                    id="from"
                    onChange={handleDateChange}
                    className="border-2 text-sm rounded-lg p-2 bg-[#F0F0F0] border-[#D6D6D6]"
                    value={fromDate}
                    required
                  />
                </div>
                <div className="flex items-center justify-center mb-2">
                  <label
                    htmlFor="to"
                    className=" font-bold text-sm  text-gray-900 mr-2"
                  >
                    To
                  </label>
                  <input
                    type="date"
                    id="to"
                    onChange={handleDateChange}
                    value={toDate}
                    className="border-2 text-sm rounded-lg p-2 bg-[#F0F0F0] border-[#D6D6D6]"
                    required
                  />
                </div>
              </form>
            </div>
          )}
          <TripList rows={rows} getTrips={getTrips} />
        </div>
      </Layout>
    </>
  );
}

export default Home;
