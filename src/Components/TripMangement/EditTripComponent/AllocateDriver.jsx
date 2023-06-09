import React from "react";

export default function AllocateDriver(props) {
  const {
    DriverName,
    DriverVehicleType,
    DriverVehicleNumber,
    DriverMobileNumber,
  } = props;
  return (
    <>
      <div className="flex flex-col md:flex-row -mx-2 mb-6  ">
        <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0 ">
          <label
            className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
            for="grid-first-name"
          >
            Driver Name
          </label>
          <input
            placeholder="Driver Name"
            type="text"
            className="appearance-none block w-full md:w-[229px] focus:outline-none focus:bg-white focus:border-gray-500 bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
            value={DriverName}
            disabled
          />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <label
            className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
            for="grid-last-name"
          >
            Mobile Number
          </label>
          <input
            placeholder="Mobile Number"
            type="text"
            className="appearance-none block w-full md:w-[229px] focus:outline-none focus:bg-white focus:border-gray-500 bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
            value={DriverMobileNumber}
            disabled
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row -mx-2 mb-6  ">
        <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0 ">
          <label
            className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
            for="grid-first-name"
          >
            Vehicle Type
          </label>
          <input
            placeholder="Vehicle Type"
            type="text"
            className="appearance-none block w-full md:w-[229px] focus:outline-none focus:bg-white focus:border-gray-500 bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
            value={DriverVehicleType}
            disabled
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
            for="grid-last-name"
          >
            Vehicle Number
          </label>
          <input
            placeholder="Vehicle Number"
            type="text"
            className="appearance-none block w-full md:w-[229px] focus:outline-none focus:bg-white focus:border-gray-500 bg-white font-sans font-medium text-base text-[#393E46] border-2 border-gray-200 rounded-md hover:border-[#393E46] py-3 px-4 leading-tight hover:outline-none hover:bg-white"
            value={DriverVehicleNumber}
            disabled
          />
        </div>
      </div>
    </>
  );
}
