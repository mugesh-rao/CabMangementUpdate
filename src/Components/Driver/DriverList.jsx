import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, where, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import Layout from "../../Layout/Layout";

export default function DriversList() {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    window.localStorage.getItem("driversSearchQuery") || ""
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState(
    window.localStorage.getItem("driversSelectedVehicleType") || ""
  );

  useEffect(() => {
    getDrivers();
  }, [searchQuery, selectedVehicleType]);

  const getDrivers = async () => {
    try {
      let queryRef = collection(db, "Drivers");

      if (selectedVehicleType) {
        // Apply the where condition if a selected vehicle type is provided
        queryRef = query(
          queryRef,
          where("vehicleType", "==", selectedVehicleType)
        );
      }

      const data = await getDocs(queryRef);
      const drivers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const filteredData = drivers.filter(
        (driver) =>
          driver.driverID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.mobileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const sortedData = filteredData.sort((a, b) =>
        a.driverID.localeCompare(b.driverID)
      );

      setRows(sortedData);
    } catch (error) {
      console.error("Error getting drivers:", error);
    }
  };

  window.onbeforeunload = () => {
    localStorage.removeItem("driversSearchQuery");
    localStorage.removeItem("driversSelectedVehicleType");
  };
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col justify-between px-4 py-3 mx-0 mt-2 bg-white border-2 md:flex-row border-1 rounded-xl">
            <form className="w-full mb-2 md:mb-0 md:w-auto md:mr-4">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
              >
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const searchQuery = e.target.value;
                    setSearchQuery(searchQuery);
                    window.localStorage.setItem(
                      "driversSearchQuery",
                      searchQuery
                    );
                  }}
                  className="border-2 text-sm rounded-lg block w-full pl-10 p-2 bg-[#F0F0F0] border-[#D6D6D6] placeholder-black focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
            <div className="flex flex-row gap-2">
              <select
                value={selectedVehicleType}
                onChange={(e) => {
                  const selectedVehicleType = e.target.value;
                  setSelectedVehicleType(selectedVehicleType);
                  window.localStorage.setItem(
                    "driversSelectedVehicleType",
                    selectedVehicleType
                  );
                }}
                className="mb-2 md:mb-0 w-full md:w-auto md:mr-4 border-2 text-[#393E46] font-normal font-sans text-sm rounded-lg px-2 bg-[#F0F0F0] border-[#D6D6D6] focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Vehicle Type</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6 m-2 mt-4 bg-white rounded-lg shadow-lg ">
            <table className="border-collapse ">
              <thead className="bg-[#222831]  justify-evenly items-center font-sans rounded-2xl table-row">
                <th className="p-4 text-center text-white rounded-l-xl">
                  Driver ID
                </th>
                <th className="text-center text-white">Driver Name</th>
                <th className="text-center text-white">Vehicle Name</th>
                <th className="text-center text-white">Vehicle Number</th>
                <th className="text-center text-white">Vehicle Type</th>
                <th className="text-center text-white">Mobile Number</th>
                <th className="text-center text-white rounded-r-xl">
                  Licence Exp Date
                </th>
              </thead>

              {rows.length > 0 && (
                <tbody className="table-row-group p-4 text-lg uppercase divide-x-0 rounded-md">
                  {rows.map((row) => {
                    return (
                      <tr
                        className="  rounded-lg drop-shadow-2xl text-center justify-center  shadow-lg  table-row  align-middle  outline-none     "
                        tabIndex={-1}
                        key={row.code}
                      >
                        <td className=" py-3 text-[#393e46] text-center cursor-pointer font-medium text-sm font-sans hover:transform hover:scale-125 hover:font-base transition duration-300 ease-in-out">
                          <Link to={`/view-driver/${row.id}`}>
                            <span class="py-3  text-center text-sm font-sans text-[#323EDD]  cursor-pointer font-semibold">
                              {row.driverID}
                            </span>
                          </Link>
                        </td>
                        <td className="  text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.driverName}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.vehicleName}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.vehicleNo}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.vehicleType}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <a
                            href={`https://wa.me/+91${
                              row.mobileNo
                            }?text=Hello,%20${encodeURIComponent(
                              `${row.driverName}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span class="text-[#393e46]">{row.mobileNo}</span>
                          </a>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.licExpDate}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}
