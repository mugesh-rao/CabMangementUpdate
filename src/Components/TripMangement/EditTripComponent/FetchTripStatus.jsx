import React, { useState, useEffect } from "react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../../config/FirebaseConfig";
// import { useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import Swal from "sweetalert2";

export default function FetchTripStatus(props) {
  const { TripStatus } = props;
  return (
    <>
      <div className="w-full h-[167px] border bg-white shadow-xl rounded-lg ">
        <h1 className="text-center text-lg p-2 font-sf_heavy_italic">
          Vehcile Status
        </h1>
        <div className="relative h-6 md:p-2 w-4/5  mt-8 p-2 mx-8  rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
            style={{ width: `70%` }}
          ></div>
          <div className="absolute left-0 top-0 h-full  rounded-full flex justify-center items-center md:w-12 w-10">
            <span className="text-white text-xs md:text-base">{`70%`}</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[154px] h-auto md:h-[167px] border bg-white items-center flex flex-col shadow-lg rounded-lg p-4 gap-5">
        <span className="text-lg font-sf_bold">Trip Status</span>
        <div
          className={
            TripStatus === "Alloted"
              ? "bg-[#ff8103] w-12 h-12 rounded "
              : TripStatus === "Not Alloted"
              ? "bg-[#31007a] w-12 h-12 rounded "
              : TripStatus === "Ongoing"
              ? "bg-[#e8d100] w-12 h-12 rounded "
              : "bg-[#2daa00] w-12 h-12 rounded "
          }
        />
        <select
          value={TripStatus}
          className="bg-gray-300 text-black p-2  rounded-lg border-2 border-[#222831] appearance-none hover:bg-[#222831] hover:text-white cursor-pointer text-center"
        >
          <option value="Alloted">Alloted</option>
          <option value="Not Alloted">Not Alloted</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </>
  );
}
