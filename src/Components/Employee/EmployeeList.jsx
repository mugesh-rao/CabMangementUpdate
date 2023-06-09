import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Layout from "../../Layout/Layout";

export default function ViewEmployee() {
  const [rows, setRows] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    window.localStorage.getItem("searchQuery") || ""
  );
  const [companyId, setCompanyId] = useState(
    window.localStorage.getItem("companyId") || ""
  );

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    localStorage.setItem("searchQuery", e.target.value);
  };
  const handleCompanyNameChange = (e) => {
    setCompanyId(e.target.value);
    localStorage.setItem("companyId", e.target.value);
  };

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = async () => {
    const data = await getDocs(collection(db, "corporateCompany"));
    setCompanyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getEmployees = async () => {
    try {
      let queryRef;

      if (companyId === "") {
        // Retrieve all company data
        queryRef = collection(db, "corporateEmployees");
      } else {
        // Retrieve data for specific companyId
        queryRef = query(
          collection(db, "corporateEmployees"),
          where("companyId", "==", companyId)
        );
      }

      const data = await getDocs(queryRef);
      const employees = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const employeeDataWithCompanyName = await Promise.all(
        employees.map(async (employee) => {
          const companyDoc = await getDoc(
            doc(db, "corporateCompany", employee.companyId)
          );
          const companyName = companyDoc.exists()
            ? companyDoc.data().companyName
            : null;

          return { ...employee, companyName };
        })
      );

      // Filter employeeDataWithCompanyName based on searchQuery
      const filteredData = employeeDataWithCompanyName.filter(
        (employee) =>
          employee.employeeId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          employee.employeeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );

      setRows(filteredData);
    } catch (error) {
      console.error("Error getting employees:", error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [companyId, searchQuery]);

  window.onbeforeunload = () => {
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('companyId');
  };

  return (
    <Layout>
      <div>
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col md:flex-row justify-between border-2 bg-white py-3 px-4 border-1 rounded-xl mt-2 mx-0">
            <form className="mb-2 md:mb-0 w-full md:w-auto md:mr-4">
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
                  onChange={handleQueryChange}
                  className="border-2 text-[#393E46] font-normal font-sans text-sm rounded-lg block w-full pl-10 p-2 bg-[#F0F0F0] border-[#D6D6D6] placeholder-black focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
            </form>

            <div className="flex flex-row gap-2">
              <select
                onChange={handleCompanyNameChange}
                value={companyId}
                className="mb-2 md:mb-0 w-full md:w-auto md:mr-4 border-2 text-[#393E46] font-normal font-sans text-sm rounded-lg p-2 bg-[#F0F0F0] border-[#D6D6D6] focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Comapny</option>
                {companyList &&
                  companyList.map((company) => (
                    <option value={company.id}>{company.companyName}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className=" m-2 mt-4 bg-white rounded-lg flex flex-col gap-6 shadow-lg ">
            <table className="border-collapse ">
              <thead className="bg-[#222831]  text-white font-sans rounded-2xl table-row ">
                <th className=" p-4 rounded-l-xl  text-center text-white">
                  Employee ID
                </th>
                <th className=" text-white text-left">Employee Name</th>
                <th className=" text-white text-left">Company Name</th>
                <th className=" text-white text-center">Gender</th>
                <th className=" text-white text-center">Mobile Number</th>
              </thead>
              {rows.length > 0 && (
                <tbody className="table-row-group p-4 text-lg divide-x-0  uppercase rounded-md">
                  {rows.map((row) => {
                    return (
                      <tr
                        className="  rounded-lg drop-shadow-2xl text-center justify-center  shadow-lg  table-row  align-middle  outline-none     "
                        tabIndex={-1}
                      >
                        <td className=" py-3 text-[#393e46] text-center cursor-pointer font-medium text-sm font-sans hover:transform hover:scale-125 hover:font-base transition duration-300 ease-in-out">
                          <Link to={`/view-employee/${row.id}`}>
                            <span class="py-3  text-center text-sm font-sans text-[#323EDD]  cursor-pointer font-semibold">
                              {row.employeeId}
                            </span>
                          </Link>
                        </td>
                        <td className="  text-[#393e46]  text-left  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.employeeName}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-left  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">
                            {row.companyName}
                          </span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span className="text-[#393e46]">{row.gender}</span>
                        </td>
                        <td className=" py-3 text-[#393e46]  text-center  font-medium text-sm font-sans">
                          <span class="text-[#393e46]">{row.mobileNo}</span>
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
    </Layout>
  );
}
