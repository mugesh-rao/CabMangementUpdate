import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { AiFillCar, AiOutlineCloudUpload } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbAddressBook, TbEdit } from "react-icons/tb";
import backButton from "../../assets/Icons/IconsForPages/backArrow.png";
import driver from "../../assets/Icons/IconsForPages/driver.png";
import mobile from "../../assets/Icons/IconsForPages/smartphone.png";
import calendar from "../../assets/Icons/IconsForPages/calendar.png";
import license from "../../assets/Icons/IconsForPages/license.png";
import sedan from "../../assets/Icons/IconsForPages/sedan.png";
import UPI from "../../assets/Icons/IconsForPages/upi.png";
import aadhar from "../../assets/Icons/IconsForPages/aadhar.png";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdBloodtype } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Layout from "../../Layout/Layout";
const { v4: uuidv4 } = require("uuid");

export default function AddDriver({ props }) {
  const [DriverNo, setDriverNo] = useState("CCD0001");
  const [DriverName, setDriverName] = useState("");
  const [VehicleName, setVehicleName] = useState("");
  const [VehicleType, setVehicleType] = useState("");
  const [VehicleNo, setVehicleNo] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [UpiId, setUpiId] = useState("");
  const [InsuranceExpDate, setInsuranceExpDate] = useState("");
  const [LicenseExpDate, setLicenseExpDate] = useState("");
  const [AadharNum, setAadharNum] = useState("");
  const [AlternateNumber, setAlternateNumber] = useState("");
  const [LicenseNumber, setLicenseNumber] = useState("");
  const [PermanentAddress, setPermanentAddress] = useState("");
  const [TempAddress, setTempAddress] = useState("");
  const [PermitExpDate, setPermitExpDate] = useState("");
  const [TaxExpDate, setTaxExpDate] = useState("");
  const [FCExpDate, setFCExpDate] = useState("");
  const [BloodGroup, setBloodGroup] = useState("");

  const [ViewDriver, setViewDriver] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  const [progressPercent, setProgressPercent] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const [driverError, setDriverError] = useState("");
  const [mobileNoError, setMobileNoError] = useState("");
  const [vehicleNameError, setVehicleNameError] = useState("");
  const [vehicleNoError, setVehicleNoError] = useState("");
  const [vehicleTypeError, setVehicleTypeError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const handleEditClick = () => {
    setViewDriver(false);
    setPageTitle("Update Driver");
  };

  useEffect(() => {
    setPageTitle(id ? "Driver Details" : "Driver Registration");
    if (!id) {
      setViewDriver(false);
      getLatestDocument();
    } else {
      const docRef = doc(db, "Drivers", id);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const driverData = docSnap.data();
          setDriverNo(driverData.driverID);
          setDriverName(driverData.driverName);
          setVehicleName(driverData.vehicleName);
          setVehicleType(driverData.vehicleType);
          setVehicleNo(driverData.vehicleNo);
          setMobileNo(driverData.mobileNo);
          setUpiId(driverData.upiId);
          setInsuranceExpDate(driverData.insExpDate);
          setLicenseExpDate(driverData.licExpDate);
          setAadharNum(driverData.aadharNum);
          setAlternateNumber(driverData.alternateNumber);
          setLicenseNumber(driverData.licenseNumber);
          setPermanentAddress(driverData.permanentAddress);
          setTempAddress(driverData.tempAddress);
          setPermitExpDate(driverData.permitExpDate);
          setTaxExpDate(driverData.taxExpDate);
          setFCExpDate(driverData.fCExpDate);
          setBloodGroup(driverData.bloodGroup);
          console.log("Document data:", docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    }
  }, [id]);

  async function getLatestDocument() {
    const q = query(
      collection(db, "Drivers"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // No documents found
    }

    const latestDocument = querySnapshot.docs[0];
    const currentDriverId = latestDocument.data().driverID;
    const nextDriverId = incrementDriverId(currentDriverId);
    return latestDocument.data();
  }

  function incrementDriverId(driverId) {
    const currentNumber = parseInt(driverId.substring(3));
    const nextNumber = currentNumber + 1;
    const nextDriverId = `CCD${nextNumber.toString().padStart(4, "0")}`;
    setDriverNo(nextDriverId);
    return nextDriverId;
  }

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (handleFormValidation()) {
      try {
        const doc = collection(db, "Drivers");
        const docId = uuidv4();
        await addDoc(doc, {
          id: docId,
          driverID: DriverNo,
          driverName: DriverName,
          vehicleName: VehicleName,
          vehicleType: VehicleType,
          vehicleNo: VehicleNo,
          insExpDate: InsuranceExpDate,
          licExpDate: LicenseExpDate,
          mobileNo: MobileNo,
          upiId: UpiId,
          driverImg: downloadURL,
          aadharNum: AadharNum,
          alternateNumber: AlternateNumber,
          licenseNumber: LicenseNumber,
          permanentAddress: PermanentAddress,
          tempAddress: TempAddress,
          permitExpDate: PermitExpDate,
          taxExpDate: TaxExpDate,
          fCExpDate: FCExpDate,
          bloodGroup: BloodGroup,
          createdAt: new Date().toISOString(),
        });
        let messages = ` Dear ${DriverName},
\n Welcome to Chennai Cabs! We are thrilled to have you join our team of expert drivers. Your driver ID is *${DriverNo}*.
      \nThank you for choosing to work with Chennai Cabs. We look forward to a Great partnership with you!
      \n*Best regards*,
Chennai Cabs Team`;

        try {
          await axios.get(
            `https://api.textmebot.com/send.php?recipient=+91${MobileNo}&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(
              messages
            )}`
          );
        } catch (error) {
          console.log("error ::::::::: ", error);
        }
        toast("New Driver Added Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/driver-list");
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
        await setDoc(doc(db, "Drivers", id), {
          driverID: DriverNo,
          driverName: DriverName,
          vehicleName: VehicleName,
          vehicleType: VehicleType,
          vehicleNo: VehicleNo,
          insExpDate: InsuranceExpDate,
          licExpDate: LicenseExpDate,
          mobileNo: MobileNo,
          upiId: UpiId,
          driverImg: downloadURL,
          aadharNum: AadharNum,
          alternateNumber: AlternateNumber,
          licenseNumber: LicenseNumber,
          permanentAddress: PermanentAddress,
          tempAddress: TempAddress,
          permitExpDate: PermitExpDate,
          taxExpDate: TaxExpDate,
          fCExpDate: FCExpDate,
          bloodGroup: BloodGroup,
          updatedAt: new Date().toISOString(),
        });
        // navigate("/view-driver");
        toast("Driver Updated Successfully!", {
          icon: "👏",
          style: {
            borderRadius: "7px",
            background: "#222831",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/driver-list");
        }, 2000);
      } catch (e) {
        console.error("Errors adding document: ", e);
      }
    }
  };

  const handleFormValidation = () => {
    let newFormErrors = {};
    let formIsValid = true;

    if (!DriverName) {
      formIsValid = false;
      setDriverError("Please enter driver name");
    } else {
      setDriverError("");
    }

    if (!MobileNo) {
      formIsValid = false;
      setMobileNoError("Please enter mobile number");
    } else if (!/^[6-9]\d{9}$/.test(MobileNo)) {
      formIsValid = false;
      setMobileNoError("Please enter a valid Indian mobile number");
    } else {
      setMobileNoError("");
    }

    if (!VehicleName) {
      formIsValid = false;
      setVehicleNameError("Please enter vehicle name");
    } else {
      setVehicleNameError("");
    }
    if (!VehicleNo) {
      formIsValid = false;
      setVehicleNoError("Please enter vehicle number");
    } else {
      setVehicleNoError("");
    }

    if (VehicleType == "") {
      formIsValid = false;
      setVehicleTypeError("Please select vehicle type");
    } else {
      setVehicleTypeError("");
    }

    setFormErrors(newFormErrors);

    return formIsValid;
  };

  const handleDeleteDriver = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You are about to delete this driver. This action cannot be undone!",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const docRef = doc(db, "Drivers", id);
      await deleteDoc(docRef);
      navigate("/driver-list");
    }
  };

  return (
    <Layout>
      <div>
        <Toaster />
        <div className='"w-full max-w-lg"'>
          <div className="drop-shadow-lg  bg-white  rounded-md">
            <div className="container">
              <div className="flex flex-wrap w-full justify-start items-center ">
                <div className="flex ml-8 flex-wrap">
                  <div className="ml-8 p-2 ">
                    <Link
                      to={"/driver-list"}
                      className="text-white w-10 h-10 flex justify-center items-center  bg-[#ffffff] cursor-pointer drop-shadow-lg rounded-xl hover:bg-[#788a9a] active:bg-[#1e1e1e]"
                    >
                      <img src={backButton} className="w-5" alt="" srcset="" />
                    </Link>
                  </div>
                </div>
                {!ViewDriver ? null : (
                  <div className=" p-2  flex">
                    <div
                      className="p-2 bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400"
                      onClick={handleDeleteDriver}
                    >
                      <RiDeleteBin6Line className="text-[#ff0000] w-6 h-6" />
                    </div>
                    <div
                      onClick={handleEditClick}
                      className="p-2 ml-4  bg-white rounded-lg shadow-md cursor-pointer drop-shadow-md hover:bg-gray-200 active:bg-gray-400"
                    >
                      <FiEdit className="text-[#38e54d] w-6 h-6 " />
                    </div>
                  </div>
                )}
              </div>
              <div className="content-center mb-3 text-center ">
                <h1 className="font-bold text-[25px] text-black justify-center text-center">
                  {pageTitle}
                </h1>
              </div>
              <div className="object-center flex items-center justify-center gap-5">
                <div className="w-[90px] rounded-md h-[100px] pt-2 pl-2 pb-2 pr-2 border-2 border-dashed border-[#00abb3] drop-shadow-lg bg-white float-right">
                  <div className="items-center m-3">
                    <form className="form">
                      <label htmlFor="upload" className="cursor-pointer">
                        <AiOutlineCloudUpload className="text-[#00abb3] h-12 w-12" />
                      </label>
                      <input type="file" className="hidden" id="upload" />
                      <button type="submit" htmlFor="upload">
                        Upload
                      </button>
                    </form>
                  </div>
                  {!downloadURL && (
                    <div className="bg-[#393e46] rounded-md overflow-hidden">
                      <div
                        className="bg-[#00adb5] h-2"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="text-xs text-white font-bold text-center py-1">
                          {progressPercent}%
                        </div>
                      </div>
                    </div>
                  )}
                  {downloadURL && (
                    <div>
                      <p>File uploaded successfully!</p>
                      <img src={downloadURL} alt="Uploaded File" />
                    </div>
                  )}
                </div>
              </div>

              <div className="container h-auto px-6 py-0 ">
                <div className="container h-auto p-12">
                  <div>
                    <h1>Driver Details</h1>
                  </div>
                  <div className="shadow-md rounded-md border mb-4  p-4 border-solid border-gray-500">
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label
                          class="block text-base font-sans font-semibold text-[#393E46] mb-1  tracking-wide"
                          for="grid-state"
                        >
                          Driver ID
                        </label>
                        <div class="w-full font-sans font-medium text-base text-[#393E46] bg-white  border-2  border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white">
                          <input
                            placeholder="Enter Driver ID"
                            value={DriverNo}
                            type="text"
                            disabled
                          />
                        </div>
                      </div>
                      <label
                        htmlFor="driverName"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Driver Name <span className="text-red-600">*</span>
                        </div>
                        <img
                          src={driver}
                          alt=""
                          className=" w-8 h-8 absolute top-9   left-5 "
                        />
                        <input
                          type="text"
                          name="driverName"
                          id="driverName"
                          placeholder="Enter Driver Name"
                          value={DriverName}
                          onChange={(e) => setDriverName(e.target.value)}
                          pattern="^[A-Za-z]+$"
                          required
                          class="w-full pl-10 font-sans font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          disabled={ViewDriver}
                        />
                        {driverError && (
                          <p className=" text-red-500 text-sm mt-1">
                            {driverError}
                          </p>
                        )}
                      </label>
                      <label
                        htmlFor="grid-zip"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Mobile Number<span className="text-red-600">*</span>
                        </div>
                        <img
                          src={mobile}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Mobile Number"
                          maxLength={10}
                          minLength={10}
                          onChange={(e) => setMobileNo(e.target.value)}
                          value={MobileNo}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="tel"
                          disabled={ViewDriver}
                        />

                        {mobileNoError && (
                          <p className="text-red-500 text-sm mt-1">
                            {mobileNoError}
                          </p>
                        )}
                      </label>
                    </div>
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <label
                        htmlFor="grid-state"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Vehicle Number <span className="text-red-600">*</span>
                        </div>
                        <img
                          src={license}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Vehicle Number"
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          onChange={(e) => setVehicleNo(e.target.value)}
                          value={VehicleNo}
                          type="text"
                          disabled={ViewDriver}
                        />
                        {vehicleNoError && (
                          <p className="text-red-500 text-sm mt-1">
                            {vehicleNoError}
                          </p>
                        )}
                      </label>
                      <label className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Vehicle Name<span className="text-red-600">*</span>
                        </div>
                        <img
                          src={sedan}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Vehicle Name"
                          onChange={(e) => setVehicleName(e.target.value)}
                          value={VehicleName}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="text"
                          disabled={ViewDriver}
                        />
                        {vehicleNameError && (
                          <p className="text-red-500 text-sm mt-1">
                            {vehicleNameError}
                          </p>
                        )}
                      </label>

                      <label className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Vehicle Type<span className="text-red-600">*</span>
                        </div>
                        <AiFillCar className="w-6 h-6 absolute top-10 left-5 " />

                        <select
                          onChange={(e) => setVehicleType(e.target.value)}
                          value={VehicleType}
                          class="pl-10 font-sans font-medium text-base text-[#393E46] borde-2 border-[#D6D6D6] focus:border-[#393E46] block appearance-none w-full bg-white  border py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white"
                          disabled={ViewDriver}
                        >
                          <option selected value="">
                            Select Vehicle Type
                          </option>
                          <option value="Sedan">Sedan</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="SUV">SUV</option>
                        </select>
                        {vehicleTypeError && (
                          <p className="text-red-500 text-sm mt-1">
                            {vehicleTypeError}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1>Driver's Documents</h1>
                  </div>
                  <div className="shadow-md rounded-md border mb-4  p-4 border-solid border-gray-500">
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          UPI ID
                        </div>
                        <img
                          src={UPI}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter UPI ID"
                          onChange={(e) => setUpiId(e.target.value)}
                          value={UpiId}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="text"
                          disabled={ViewDriver}
                        />
                      </label>

                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Aadhar Number
                        </div>
                        <img
                          src={aadhar}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Aadhar Number"
                          onChange={(e) => setAadharNum(e.target.value)}
                          value={AadharNum}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="number"
                          disabled={ViewDriver}
                        />
                      </label>
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Driving License
                        </div>
                        <img
                          src={license}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Driving License"
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          value={LicenseNumber}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="text"
                          disabled={ViewDriver}
                        />
                      </label>
                    </div>
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Permanent Address
                          <span className="text-red-600">*</span>
                        </div>
                        <TbAddressBook className="w-6 h-6 absolute top-10 left-5 " />

                        <textarea
                          placeholder="Enter Permanent Address"
                          onChange={(e) => setPermanentAddress(e.target.value)}
                          value={PermanentAddress}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          cols="1"
                          rows="1"
                          disabled={ViewDriver}
                        ></textarea>
                      </label>
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Temporary Address
                        </div>
                        <TbAddressBook className="w-6 h-6 absolute top-10 left-5 " />

                        <textarea
                          placeholder="Enter Temporary Address"
                          onChange={(e) => setTempAddress(e.target.value)}
                          value={TempAddress}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          cols="1"
                          rows="1"
                          disabled={ViewDriver}
                        ></textarea>
                      </label>

                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          License Batch Exp
                        </div>
                        <img
                          src={license}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter License Batch Exp"
                          onChange={(e) => setLicenseExpDate(e.target.value)}
                          value={LicenseExpDate}
                          className="w-full appearance-none  pl-10 font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white  rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          disabled={ViewDriver}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1>Other Details</h1>
                  </div>
                  <div className="shadow-md rounded-md border mb-4  p-4 border-solid border-gray-500">
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Permit Exp Date
                        </div>
                        <img
                          src={calendar}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Permit Exp Date"
                          onChange={(e) => setPermitExpDate(e.target.value)}
                          value={PermitExpDate}
                          className="w-full  pl-10 font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white  rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          disabled={ViewDriver}
                        />
                      </label>

                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Tax Exp Date
                        </div>
                        <img
                          src={calendar}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Tax Exp Date"
                          onChange={(e) => setTaxExpDate(e.target.value)}
                          value={TaxExpDate}
                          className="w-full  pl-10 font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white  rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          disabled={ViewDriver}
                        />
                      </label>
                      <label
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                        htmlFor=""
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          FC Exp Date
                        </div>
                        <img
                          src={calendar}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter FC Exp Date"
                          onChange={(e) => setFCExpDate(e.target.value)}
                          value={FCExpDate}
                          className="w-full  pl-10 font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] bg-white  rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          disabled={ViewDriver}
                        />
                      </label>
                    </div>
                    <div class="flex flex-wrap mt-2 -mx-3 mb-4">
                      <label
                        htmlFor="grid-zip"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Mobile Number<span className="text-red-600">*</span>
                        </div>
                        <img
                          src={mobile}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Mobile Number"
                          maxLength={10}
                          minLength={10}
                          onChange={(e) => setMobileNo(e.target.value)}
                          value={MobileNo}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="tel"
                          disabled={ViewDriver}
                        />
                      </label>
                      <label
                        htmlFor="grid-zip"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Blood Group
                        </div>
                        <MdBloodtype className="w-6 h-6 absolute top-10 left-5 " />

                        <input
                          placeholder="Enter Blood Group"
                          onChange={(e) => setBloodGroup(e.target.value)}
                          value={BloodGroup}
                          className="w-full font-sans pl-10 font-medium text-base text-[#393E46] bg-white border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white flex items-center"
                          type="text"
                          disabled={ViewDriver}
                        />
                      </label>

                      <label
                        htmlFor="grid-zip"
                        className="relative text-gray-400 focus-within:text-gray-600 block w-full md:w-1/3 px-3 mb-6 md:mb-0"
                      >
                        <div className="block text-base font-sans font-semibold text-[#393E46] mb-1 tracking-wide">
                          Insurance Exp Date
                        </div>
                        <img
                          src={calendar}
                          alt=""
                          className="w-6 h-6 absolute top-10 left-5 "
                        />
                        <input
                          placeholder="Enter Insurance Exp Date"
                          onChange={(e) => setInsuranceExpDate(e.target.value)}
                          value={InsuranceExpDate}
                          id="start"
                          className="w-full pl-10  bg-white font-sans font-medium text-base text-[#393E46] border-2 border-[#D6D6D6] focus:border-[#393E46] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="date"
                          disabled={ViewDriver}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full  mt-10 ">
                    {ViewDriver ? null : (
                      <button
                        className="p-2"
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
