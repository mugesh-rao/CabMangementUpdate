import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, Link, useParams } from "react-router-dom";
import backButton from "../../assets/Icons/IconsForPages/backArrow.png";
import editButton from "../../assets/Icons/IconsForPages/edit.png";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Layout from "../../Layout/Layout";

export default function AddEmployee(props) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [Gender, setGender] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [CompanyList, setCompanyList] = useState([]);

  const [ViewEmployee, setViewEmployee] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  const [EmployeeIdError, setEmployeeIdError] = useState("");
  const [EmployeeNameError, setEmployeeNameError] = useState("");
  const [CompanyNameError, setCompanyNameError] = useState("");
  const [GenderError, setGenderError] = useState("");
  const [MobileNoError, setMobileNoError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // const pageTitle = id ? "Update Employee" : "Add Employee";

  const handleEditClick = () => {
    setViewEmployee(false);
    setPageTitle("Update Employee");
  };

  useEffect(() => {
    setPageTitle(id ? "Employee Details" : "Employee Registration");
    if (id) {
      const docRef = doc(db, "corporateEmployees", id);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const employeeData = docSnap.data();
          setEmployeeId(employeeData.employeeId);
          setEmployeeName(employeeData.employeeName);
          setCompanyId(employeeData.companyId);
          setGender(employeeData.gender);
          setMobileNo(employeeData.mobileNo);

          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      });
    } else {
      setViewEmployee(false);
    }
    getCompany();
  }, [id]);

  const getCompany = async () => {
    const data = await getDocs(collection(db, "corporateCompany"));
    setCompanyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        const doc = collection(db, "corporateEmployees");
        await addDoc(doc, {
          employeeId: EmployeeId,
          employeeName: EmployeeName,
          companyId: CompanyId,
          gender: Gender,
          mobileNo: MobileNo,
          createdAt: new Date().toISOString(),
        });

        toast("New Employee Added Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/employee-list");
        }, 2000);
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        await setDoc(doc(db, "corporateEmployees", id), {
          employeeId: EmployeeId,
          employeeName: EmployeeName,
          companyId: CompanyId,
          gender: Gender,
          mobileNo: MobileNo,
          updatedAt: new Date().toISOString(),
        });
        toast("Employees Updated Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/employee-list");
        }, 2000);
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const handleFormValidation = () => {
    let formIsValid = true;

    if (!EmployeeId) {
      formIsValid = false;
      setEmployeeIdError("Please enter employee id");
    } else {
      setEmployeeIdError("");
    }

    if (!EmployeeName) {
      formIsValid = false;
      setEmployeeNameError("Please enter employee name");
    } else {
      setEmployeeNameError("");
    }

    if (CompanyId == "") {
      formIsValid = false;
      setCompanyNameError("Please select company");
    } else {
      setCompanyNameError("");
    }
    if (Gender == "") {
      formIsValid = false;
      setGenderError("Please select gender");
    } else {
      setGenderError("");
    }

    // if (!MobileNo) {
    //   formIsValid = false;
    //   setMobileNoError("Please enter mobile number");
    // } else if (!/^[6-9]\d{9}$/.test(MobileNo)) {
    //   formIsValid = false;
    //   setMobileNoError("Please enter a valid Indian mobile number");
    // } else {
    //   setMobileNoError("");
    // }

    return formIsValid;
  };

  const handleDeleteEmployee = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You are about to delete this employee. This action cannot be undone!",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const docRef = doc(db, "corporateEmployees", id);
      await deleteDoc(docRef);
      navigate("/employee-list");
    }
  };

  return (
    <Layout>
      <div>
        <Toaster />
        <div className='"w-full max-w-lg"'>
          <div className="bg-white rounded-md drop-shadow-lg">
            <div className="container">
              <div className="flex flex-wrap w-full ">
                <div className="flex flex-wrap ml-10  justify-center items-center">
                  <div className=" m-5  bg-[#ffffff] cursor-pointer drop-shadow-lg rounded-xl">
                    <Link
                      to={"/employee-list"}
                      className="text-white w-10 h-10 flex justify-center items-center"
                    >
                      <img className="w-5" src={backButton} alt="" srcset="" />
                    </Link>
                  </div>
                  {!ViewEmployee ? null : (
                    <div className="  flex  drop-shadow-lg rounded-xl">
                      <div
                        className="p-2 bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400"
                        onClick={handleDeleteEmployee}
                      >
                        <RiDeleteBin6Line className="text-[#ff0000] w-6 h-6" />
                      </div>
                      <Link
                        onClick={handleEditClick}
                        className="text-white  ml-4 w-10 h-10 flex justify-center items-center"
                      >
                        <div className="p-2 bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400">
                          <FiEdit className="text-[#38e54d] w-6 h-6 " />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="content-center mb-8 ">
              <h1 className="font-bold text-[25px] text-black justify-center text-center">
                {pageTitle}
              </h1>
            </div>
            <div className="flex justify-between items-center h-fit ">
              <div className="container h-auto px-6 py-0 ">
                <div className="container h-auto px-12">
                  <div className="flex flex-wrap mt-2 -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1  tracking-wide"
                        htmlFor="employee-id"
                      >
                        Employee ID
                      </label>
                      <input
                        placeholder="Employee ID"
                        className="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        onChange={(e) => setEmployeeId(e.target.value)}
                        value={EmployeeId}
                        type="text"
                        id="employee-id"
                        disabled={ViewEmployee}
                      />
                      {EmployeeIdError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {EmployeeIdError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        htmlFor="employee-name"
                      >
                        Employee Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        placeholder="Employee Name"
                        onChange={(e) => setEmployeeName(e.target.value)}
                        value={EmployeeName}
                        required
                        className="w-full bg-white font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] rounded-lg focus:border-[#393E46] py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        type="text"
                        id="employee-name"
                        disabled={ViewEmployee}
                      />
                      {EmployeeNameError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {EmployeeNameError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-2 -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1  tracking-wide"
                        htmlFor="company-name"
                      >
                        Company Name <span className="text-red-600">*</span>
                      </label>
                      <select
                        className="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] rounded-lg py-3 px-4 leading-tight focus:border-[#393E46] focus:outline-none focus:bg-white"
                        onChange={(e) => setCompanyId(e.target.value)}
                        value={CompanyId}
                        id="company-name"
                        disabled={ViewEmployee}
                      >
                        <option value="">--- Select Company Name ---</option>
                        {CompanyList &&
                          CompanyList.map((company) => (
                            <option value={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                      </select>
                      {CompanyNameError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {CompanyNameError}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide"
                        htmlFor="gender"
                      >
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select
                        className="w-full bg-white font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] rounded-lg focus:border-[#393E46] py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        onChange={(e) => setGender(e.target.value)}
                        value={Gender}
                        id="gender"
                        disabled={ViewEmployee}
                      >
                        <option value="">--- Select Gender ---</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {GenderError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {GenderError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-2 -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block text-base font-sans font-semibold text-[#393E46] mb-1  tracking-wide"
                        htmlFor="mobile-number"
                      >
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        placeholder="Mobile Number"
                        maxLength={10}
                        minLength={10}
                        onChange={(e) => setMobileNo(e.target.value)}
                        value={MobileNo}
                        className="w-full font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        type="number"
                        id="mobile-number"
                        disabled={ViewEmployee}
                      />
                      {MobileNoError && (
                        <p className=" text-red-500 text-sm mt-1">
                          {MobileNoError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full  mt-10 mb-10 ">
                    {ViewEmployee ? null : (
                      <button
                        onClick={id ? handleUpdateDriver : handleAddDriver}
                      >
                        <Link className="bg-[#00adb5] hover:bg-[#059299] active:bg-[#047481] text-gray-100 text-xl font-bold w-2/12 text-center p-5 pl-10 pr-10 rounded-lg my-6">
                          {id ? "Update" : "Submit"}
                        </Link>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
