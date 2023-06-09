// import { doc, getDoc } from 'firebase/firestore';
import React from "react";
import { useEffect } from "react";
// import { db } from '../../../config/FirebaseConfig';
import { useState } from "react";
import { useParams } from "react-router-dom";
import cabi from "./../../../assets/images/cabi.png";
import driveri from "./../../../assets/images/driveri.png";

function DriverDetailsAlloted(props) {
  const { DriverName, DriverVehicleType, DriverVehicleNumber, DriverId } =
    props;
  // const [Listing, setListing] = useState({});
  // const { company, date, type, routeId } = useParams();

  // useEffect(() => {
  //   async function fetchRoute() {
  //     const docRef = doc(db, "RouteList", company, date, "All", type, routeId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setListing(docSnap.data());
  //     }
  //   }
  //   fetchRoute();
  // }, [company, date, type, routeId]);
  return (
    <>
      <div class="flex flex-col md:flex-row w-full shadow-lg rounded-lg">
        <div class="w-full md:w-1/2 bg-white rounded-l-md md:rounded-l-md md:rounded-tr-none p-4 shadow-md flex flex-col items-center">
          <div class="text-primary">
            <img src={driveri} alt="cab" className="h-12 w-14 " />
          </div>
          <div class="text-gray-600 text-base font-medium ">Driver Details</div>
          <div class="text-primary text-lg font-medium ">{DriverName} - {DriverId}</div>
          <div class="text-gray-500 text-sm ">{DriverVehicleNumber}</div>
        </div>
        <div class="w-full md:w-1/2 bg-white rounded-tr-md md:rounded-r-md md:rounded-tl-none p-4 shadow-md flex flex-col items-center">
          <img src={cabi} alt="cab" className="h-10 w-24 " />
          <div class="text-gray-600 text-base font-medium ">
            Vehicles Details
          </div>
          <div class="text-secondary text-lg font-medium ">{DriverVehicleType}</div>
          <div class="text-gray-500 text-sm  uppercase">{DriverVehicleNumber}</div>
        </div>
      </div>
    </>
  );
}

export default DriverDetailsAlloted;
