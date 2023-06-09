import React from "react";
import close from "../../assets/images/close.png";

export default function UpdateTripStatus({
  visible,
  onClose,
  handleSubmit,
  NoOfEmployeePicked,
  TripEndTime,
  setNoOfEmployeePicked,
  setTripEndTime,
  NoOfEmployeePickedError,
  TripEndTimeError,
  TripCompleted,
  TripType,
  RouteName,
  RouteId,
}) {
  if (!visible) return null;

  return (
<div className="fixed inset-0 bg-[#222831] bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
  <div className="bg-white px-10 py-5 rounded w-full max-w-[400px] mx-auto sm:max-w-[600px]">
    <div className="mb-4">
      <img
        className="w-5 cursor-pointer ml-auto"
        onClick={onClose}
        src={close}
        alt="close"
      />
    </div>
    <div className="flex justify-center items-center h-10">
      <p className="text-center font-bold text-md text-[#222831]">{`${RouteId} - ${RouteName} - ${TripType}`}</p>
    </div>
    <br />
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col items-center">
          <label
            className="font-medium text-md text-[#222831]"
            htmlFor="numberOfEmployeePicked"
          >
            No Of Employee Picked
          </label>
          <div>
            <input
              onChange={(e) => setNoOfEmployeePicked(e.target.value)}
              className="border-2 rounded-sm border-[#D6D6D6] p-1 text-center"
              id="numberOfEmployeePicked"
              type="number"
              value={NoOfEmployeePicked}
              disabled={TripCompleted}
            />
            {NoOfEmployeePickedError && (
              <p className="text-[#FF0303]">{NoOfEmployeePickedError}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label
            className="font-medium text-md text-[#222831]"
            htmlFor="tripEndTime"
          >
            Trip End Time
          </label>
          <div>
            <input
              onChange={(e) => setTripEndTime(e.target.value)}
              className="border-2 rounded-sm border-[#D6D6D6] p-1 text-center"
              id="tripEndTime"
              type="time"
              value={TripEndTime}
              disabled={TripCompleted}
            />
            {TripEndTimeError && (
              <p className="text-[#FF0303]">{TripEndTimeError}</p>
            )}
          </div>
        </div>
      </div>
      {TripCompleted === true ? null : (
        <div className="text-center mt-5 mb-1">
          <button className="bg-[#00ADB5] px-6 py-1 rounded-md text-white">
            Trip Completed
          </button>
        </div>
      )}
    </form>
  </div>
</div>

  );
}
