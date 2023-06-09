import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import Layout from "../../Layout/Layout";

export default function ViewInvoice() {
  const [companyList, setCompanyList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [driverId, setDriverId] = useState( window.localStorage.getItem("invoicePageDriverId") || "");
  const [toDate, setToDate] = useState( window.localStorage.getItem("invoicePageToDate") || "");
  const [fromDate, setFromDate] = useState( window.localStorage.getItem("invoicePageFromDate") || "");
  const [statusSelected, setStatusSelected] = useState( window.localStorage.getItem("invoicePageStatusSelected") || "");
  const [paidAmount, setPaidAmount] = useState("");
  const [onHoldAmount, setOnHoldAmount] = useState("");
  const [notPaidAmount, setNotPaidAmount] = useState("");
  const [notPaidTodayAmount, setNotPaidTodayAmount] = useState("");
  const [todaysPaidAmount, setTodayPaidAmount] = useState("");

  const [companyId, setCompanyId] = useState(
    window.localStorage.getItem("invoicePageCompanyId") || ""
  );
  const [rows, setRows] = useState([]);
  const [invoiceStatus, setInvoiceStatus] = useState("Not Paid");
  const PriceTable = {
    AmmountTitle: [
      "Today Paid Amount",
      "Today Unpaid Amount",
      "Total Paid Amount",
      "Total Onhold Amount",
      "Total Unpaid Amount",
    ],
    Ammount: [
      todaysPaidAmount,
      notPaidTodayAmount,
      paidAmount,
      onHoldAmount,
      notPaidAmount,
    ],
  };

  function TotalCard({ title, amount }) {
    return (
      <div className="labelInput flex justify-center items-center h-full w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
        <div className="m-5 bg-teal-500 rounded-lg p-2">
          <h1 className="p-1 font-bold">{title}</h1>
          <h1 className="text-3xl font-bold text-white">₹ {amount}</h1>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getCompany();
    getTrips();
    getDriver();
  }, [driverId, fromDate, toDate, companyId, statusSelected]);

  const getDriver = async () => {
    const data = await getDocs(collection(db, "Drivers"));
    setDriverList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getCompany = async () => {
    const data = await getDocs(collection(db, "corporateCompany"));
    setCompanyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getTrips = async () => {
    let q = query(
      collection(db, "corporateTrips"),
      where("tripStatus", "==", "Completed")
    );

    if (driverId !== "") {
      q = query(q, where("allocatedDriver", "==", driverId));
    }

    if (companyId !== "") {
      q = query(q, where("companyId", "==", companyId));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Fetch company names based on company IDs
    const companyIds = data.map((trip) => trip.companyId);
    const companyNames = await Promise.all(
      companyIds.map(async (companyId) => {
        const companyDoc = await getDoc(doc(db, "corporateCompany", companyId));
        return companyDoc.exists() ? companyDoc.data().companyName : "";
      })
    );

    // Update company names and retrieve invoiceDetails subcollection
    const tripsWithCompanyNames = await Promise.all(
      data.map(async (trip, index) => {
        const invoiceSnapshot = await getDocs(
          collection(db, "corporateTrips", trip.id, "invoiceDetails")
        );
        const invoiceDetails = invoiceSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        return {
          ...trip,
          companyName: companyNames[index],
          invoiceDetails: invoiceDetails,
        };
      })
    );

    let filteredTrips = tripsWithCompanyNames;

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

    const filteredTripsToday = filteredTrips.filter(
      (trip) => trip.tripDate === indianDate
    );
    console.log(
      "filteredTripsToday-----------",
      JSON.stringify(filteredTripsToday)
    );

    let filteredTodaysTripsNotPaid = filteredTripsToday.filter((trip) => {
      return (
        trip.invoiceDetails.length === 0 ||
        (trip.invoiceDetails.length > 0 &&
          trip.invoiceDetails[0].invoicePaymentStatus === "Not Paid")
      );
    });
    // Calculate total paid amount
    const totalNotPaid = filteredTodaysTripsNotPaid.reduce((sum, trip) => {
      if (trip.invoiceDetails.length > 0) {
        const paidAmount = trip.invoiceDetails[0].invoicePaidAmount || 0;
        return sum + paidAmount;
      }
      return sum;
    }, 0);

    setNotPaidTodayAmount(parseInt(totalNotPaid));

    const filteredTodaysTripsPaidAmount = filteredTripsToday.filter((trip) => {
      return (
        trip.invoiceDetails.length > 0 &&
        trip.invoiceDetails[0].invoicePaymentStatus === "Paid"
      );
    });
    // Calculate total paid amount
    const totalPaidAmount = filteredTodaysTripsPaidAmount.reduce(
      (sum, trip) => {
        if (trip.invoiceDetails.length > 0) {
          const paidAmount = trip.invoiceDetails[0].invoicePaidAmount || 0;
          return sum + paidAmount;
        }
        return sum;
      },
      0
    );

    setTodayPaidAmount(parseInt(totalPaidAmount));

    if (fromDate && toDate) {
      // Filter trips based on fromDate and toDate
      filteredTrips = tripsWithCompanyNames.filter((trip) => {
        const tripDate = new Date(trip.tripDate);
        return tripDate >= new Date(fromDate) && tripDate <= new Date(toDate);
      });
    }

    // Filter trips based on invoice payment status
    if (statusSelected === "Not Paid") {
      filteredTrips = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length === 0 ||
          (trip.invoiceDetails.length > 0 &&
            trip.invoiceDetails[0].invoicePaymentStatus === "Not Paid")
        );
      });
    } else {
      let filteredTripsNotPaid = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length === 0 ||
          (trip.invoiceDetails.length > 0 &&
            trip.invoiceDetails[0].invoicePaymentStatus === "Not Paid")
        );
      });
      // Calculate total paid amount
      const totalNotPaid = filteredTripsNotPaid.reduce((sum, trip) => {
        if (trip.invoiceDetails.length > 0) {
          const paidAmount = trip.invoiceDetails[0].invoicePaidAmount || 0;
          return sum + paidAmount;
        }
        return sum;
      }, 0);

      setNotPaidAmount(parseInt(totalNotPaid));
    }

    if (statusSelected === "Paid") {
      filteredTrips = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length > 0 &&
          trip.invoiceDetails[0].invoicePaymentStatus === "Paid"
        );
      });
    } else {
      const filteredTripsPaidAmount = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length > 0 &&
          trip.invoiceDetails[0].invoicePaymentStatus === "Paid"
        );
      });
      // Calculate total paid amount
      const totalPaidAmount = filteredTripsPaidAmount.reduce((sum, trip) => {
        if (trip.invoiceDetails.length > 0) {
          const paidAmount = trip.invoiceDetails[0].invoicePaidAmount || 0;
          return sum + paidAmount;
        }
        return sum;
      }, 0);

      setPaidAmount(parseInt(totalPaidAmount));
    }
    if (statusSelected === "On Hold") {
      filteredTrips = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length > 0 &&
          trip.invoiceDetails[0].invoicePaymentStatus === "On Hold"
        );
      });
    } else {
      const filteredTripsOnHold = filteredTrips.filter((trip) => {
        return (
          trip.invoiceDetails.length > 0 &&
          trip.invoiceDetails[0].invoicePaymentStatus === "On Hold"
        );
      });

      // Calculate total on hold amount
      const totalOnHoldAmount = filteredTripsOnHold.reduce((sum, trip) => {
        if (trip.invoiceDetails.length > 0) {
          const onHoldAmount = trip.invoiceDetails[0].invoicePaidAmount || 0;
          return sum + onHoldAmount;
        }
        return sum;
      }, 0);
      setOnHoldAmount(parseInt(parseInt(totalOnHoldAmount)));
    }
    setRows(filteredTrips);
  };

    // Clear localStorage on page refresh
    window.onbeforeunload = () => {
      localStorage.removeItem('invoicePageDriverId');
      localStorage.removeItem('invoicePageFromDate');
      localStorage.removeItem('invoicePageToDate');
      localStorage.removeItem('invoicePageCompanyId');
      localStorage.removeItem('invoicePageStatusSelected');
    };

  return (
    <Layout>
      <div>
        <div className="flex flex-wrap -mx-4">
          <div className="container h-auto w-full ">
            <div className="paperEffect shadow-lg shadow-slate-600 p-2 m-2 h-auto w-auto rounded-md ">
              <div className="">
                <div className="labelInputContainer  flex flex-wrap justify-center items-center h-auto w-full">
                  <div className="labelInput h-full flex  flex-col  w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                    <div className=" h-full w-auto flex flex-col m-5">
                      <label className="pl-1 font-bold ">Driver ID</label>
                      <select
                        className="  font-medium font-sans text-sm bg-white text-[#393e46] border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] hover:border-gray-500 px-2 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Driver ID"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setDriverId(selectedValue);
                          localStorage.setItem(
                            "invoicePageDriverId",
                            selectedValue
                          );
                        }}
                        value={driverId}
                      >
                        <option value="">--Select Driver--</option>
                        {driverList &&
                          driverList.map((driver) => (
                            <option value={driver.id} key={driver.id}>
                              {driver.driverID}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="labelInput h-full flex  flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                    <div className=" h-full w-auto flex flex-col m-5">
                      <label className="pl-1 font-bold ">From Date</label>
                      <input
                        type="date"
                        className=" font-medium font-sans text-sm bg-white text-[#393e46] border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] hover:border-gray-500 px-2 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={fromDate}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFromDate(selectedValue);
                          localStorage.setItem(
                            "invoicePageFromDate",
                            selectedValue
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="labelInput h-full flex  flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                    <div className=" h-full w-auto flex flex-col m-5">
                      <label className="pl-1 font-bold ">To Date</label>
                      <input
                        type="date"
                        className=" font-medium font-sans text-sm bg-white text-[#393e46] border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] hover:border-gray-500 px-2 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={toDate}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setToDate(selectedValue);
                          localStorage.setItem(
                            "invoicePageToDate",
                            selectedValue
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="labelInput h-full flex  flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                    <div className=" h-full w-auto flex flex-col m-5">
                      <label className="pl-1 font-bold ">Company</label>
                      <select
                        className="  font-medium font-sans text-sm bg-white text-[#393e46] border-2 border-[#D6D6D6] focus:bg-white focus:border-[#393E46] hover:border-gray-500 px-2 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={companyId}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setCompanyId(selectedValue);
                          localStorage.setItem(
                            "invoicePageCompanyId",
                            selectedValue
                          );
                        }}
                      >
                        <option value="">All Comapny</option>
                        {companyList &&
                          companyList.map((company) => (
                            <option value={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="labelInput h-full flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                    <div className="h-full w-auto flex flex-col m-5">
                      <label className="pl-1 font-bold">Status</label>
                      <div className="relative">
                        <select
                          className="font-medium font-sans text-sm bg-white text-[#393e46] border-2 border-[#D6D6D6] hover:border-gray-500 px-2 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                          value={statusSelected}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setStatusSelected(selectedValue);
                            localStorage.setItem(
                              "invoicePageStatusSelected",
                              selectedValue
                            );
                          }}
                        >
                          <option value="">--- Select Status ---</option>
                          <option value="Not Paid">Not Paid</option>
                          <option value="Paid">Paid</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                        <span
                          className="dropdown-indicator"
                          style={{
                            backgroundColor:
                              statusSelected === "Not Paid"
                                ? "#E90064"
                                : statusSelected === "Paid"
                                ? "#03C988"
                                : statusSelected === "On Hold"
                                ? "#FF8B13"
                                : "",
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="PriceAmount h-3/5 w-full flex flex-wrap text-center">
                {PriceTable.AmmountTitle.map((title, index) => (
                  <TotalCard
                    key={index}
                    title={title}
                    amount={PriceTable.Ammount[index]}
                  />
                ))}
              </div>
            </div>
            <div className="table w-full h-auto ">
              <div className=" shadow-xl shadow-slate-600 h-auto rounded-lg  w-full ">
                <div className="flex flex-col gap-6 m-2 bg-white rounded-lg shadow-md">
                  <table className="border-collapse">
                    <thead className="bg-[#222831] text-white font-sans rounded-2xl  table-row align-middle outline-none">
                      <th className="p-4 font-sans text-sm font-semibold uppercase rounded-l-xl">
                        Route ID
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Trip Date
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Company Name
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Trip Amount
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Status
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Paid Amount
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase">
                        Paid Date
                      </th>
                      <th className="p-4 font-sans text-sm font-semibold uppercase rounded-r-xl">
                        Action
                      </th>
                    </thead>
                    <tbody className="table-row-group font-sans text-lg uppercase divide-x-0 rounded-md">
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            No Record Found
                          </td>
                        </tr>
                      ) : (
                        rows.map((invoice) => (
                          <tr
                            key={invoice.id}
                            className="justify-center table-row text-center align-middle rounded-lg shadow-lg outline-none drop-shadow-2xl"
                          >
                            <td className="p-3 text-[#393e46] text-center cursor-pointer font-medium text-sm font-sans">
                              {invoice.routeId}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              {invoice.tripDate}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              {invoice.companyName}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              {invoice.tripAmount}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              <span className="inline-block w-6 h-6 rounded-full">
                                <div
                                  className={
                                    invoice.invoiceDetails[0] &&
                                    invoice.invoiceDetails[0]
                                      .invoicePaymentStatus === "Not Paid"
                                      ? "text-[#E90064] text-sm font-sans whitespace-nowrap flex justify-center"
                                      : invoice.invoiceDetails[0] &&
                                        invoice.invoiceDetails[0]
                                          .invoicePaymentStatus === "Paid"
                                      ? "text-[#03C988] text-sm font-sans flex justify-center"
                                      : invoice.invoiceDetails[0] &&
                                        invoice.invoiceDetails[0]
                                          .invoicePaymentStatus === "On Hold"
                                      ? "text-[#FF8B13] text-sm font-sans flex justify-center"
                                      : invoiceStatus === "Not Paid"
                                      ? "text-[#E90064] text-sm font-sans whitespace-nowrap flex justify-center"
                                      : invoiceStatus === "Paid"
                                      ? "text-[#03C988] text-sm font-sans flex justify-center"
                                      : invoiceStatus === "On Hold"
                                      ? "text-[#FF8B13] text-sm font-sans flex justify-center"
                                      : null
                                  }
                                >
                                  {invoice.invoiceDetails[0] &&
                                  invoice.invoiceDetails[0].invoicePaymentStatus
                                    ? invoice.invoiceDetails[0]
                                        .invoicePaymentStatus
                                    : invoiceStatus}
                                </div>
                              </span>
                            </td>

                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              {invoice.invoiceDetails[0]?.invoicePaidAmount
                                ? invoice.invoiceDetails[0].invoicePaidAmount
                                : "-"}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              {invoice.invoiceDetails[0]?.invoicePaymentDate
                                ? new Date(
                                    invoice.invoiceDetails[0].invoicePaymentDate
                                  )
                                    .toLocaleDateString("en-GB")
                                    .replace(/\//g, "-")
                                : "-"}
                            </td>
                            <td className="p-3 text-[#393e46] text-center font-medium text-sm font-sans">
                              <Link
                                to={`/view-invoice/${invoice.id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
