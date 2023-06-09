import React from "react";

function HomeTripData({
  totalTrips,
  totalNotAllocated,
  totalAllocated,
  totalCompleted,
}) {
  return (
    <>
      <div className="m-2 md:flex-col md:flex ">
        <div class=" h-auto grid grid-cols-2 grid-rows-2 gap-5 ">
          <div class="border-[3px] border-[#00ABB3] rounded-lg py-2 flex flex-col justify-center items-center">
            <p class="text-sm  text-[#222831] font-semibold  text-center font-sans">
              Total Trip
            </p>
            <p class="text-4xl text-[#00ABB3] font-bold mt-1 text-center font-sans">
              {totalTrips}
            </p>
          </div>

          <div class="rounded-lg border-[3px] border-[#3A1078] py-2 flex flex-col justify-center items-center">
            <p class="text-sm  text-[#222831] font-semibold text-center">
              Not Alloted
            </p>
            <p class="text-4xl text-[#3A1078] font-bold mt-1 text-center font-sans">
              {totalNotAllocated}
            </p>
          </div>
          <div class="rounded-lg border-[3px] border-[#FF8B13] py-2 flex flex-col justify-center items-center">
            <p class="text-sm  text-center font-semibold text-[#222831] font-sans">
              Alloted
            </p>

            <p class="text-4xl text-[#FF8B13] font-bold mt-1 text-center font-sans">
              {totalAllocated}
            </p>
          </div>
          <div class="rounded-lg border-[3px] border-[#03C988] py-2 flex flex-col justify-center items-center">
            <p class="text-sm  text-center font-semibold font-sans ">
              Completed
            </p>
            <p class="text-4xl text-[#03C988] font-bold mt-1 text-center ">
              {totalCompleted}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeTripData;
