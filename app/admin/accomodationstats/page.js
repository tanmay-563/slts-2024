"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/_util/initApp";
import { getRegistrationData } from "@/app/_util/data";
import secureLocalStorage from "react-secure-storage";

export default function DistrictStats() {
  const router = useRouter();

  // State variables
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [checkInDateOptions, setCheckInDateOptions] = useState([]);
  const [checkOutDateOptions, setCheckOutDateOptions] = useState([]);
  const [checkInData, setCheckInData] = useState([]);

  useEffect(() => {
    const savedUser = secureLocalStorage.getItem("user");
    if (!savedUser) {
      router.push("/"); 
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    getRegistrationData().then((_data) => {
      if (!_data || _data.length !== 8) {
        console.error("Invalid registration data received");
        router.push("/"); 
        return;
      }

      setData(_data[0]);
      setDistricts(_data[1]);
      setCheckInDateOptions(_data[6]);
      setCheckOutDateOptions(_data[7]);

      const organizedData = _data[0];

      const sortedData = organizedData.sort((a, b) => {
        const dateA = new Date(a.arrivalDate);
        const dateB = new Date(b.arrivalDate);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        const timeA = a.arrivalTime;
        const timeB = b.arrivalTime;
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        const districtA = a.district.toLowerCase();
        const districtB = b.district.toLowerCase();
        if (districtA < districtB) return -1;
        if (districtA > districtB) return 1;

        return 0;
      });

      const groupedData = {};

      sortedData.forEach((item) => {
        const key = `${item.arrivalDate}_${item.arrivalTime}_${item.district}`;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(item);
      });

      const groupedRows = Object.keys(groupedData).map((key) => {
        const [arrivalDate, arrivalTime, district] = key.split("_");
        return {
          arrivalDate,
          arrivalTime,
          district,
          rows: groupedData[key],
        };
      });

      setFilteredData(groupedRows);
    });
  }, [router]);

  const uniqueDates = [
    ...new Set(filteredData.map((group) => group.arrivalDate)),
  ];

  return user && data.length ? (
    <div className="flex flex-col justify-center w-fit mx-auto">
      <div className="rounded-2xl p-4 m-4 bg-white border flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-700">{user.email}</p>
        </div>
        <button
          className="bg-[#ffcece] text-[#350b0b] font-bold px-4 py-1 rounded-xl"
          onClick={() => {
            auth.signOut();
            secureLocalStorage.clear();
            router.push("/"); 
          }}
        >
          Logout
        </button>
      </div>

      {uniqueDates.map((date, idx) => (
        <div key={idx} className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Check-In Date: {date}
          </h1>
          <div className="bg-white p-4 rounded-2xl border">
            {filteredData
              .filter((group) => group.arrivalDate === date)
              .map((group, idx) => (
                <div key={idx}>
                  <p className="text-lg font-bold">
                    Accommodation for {group.district}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    Date: {group.arrivalDate} | Time: {group.arrivalTime}
                  </p>
                  <div className="flex justify-around gap-3">
                    <div className="pt-2">
                      <p className="text-sm font-bold">Male</p>
                      <p className="text-4xl font-bold">
                        {group.rows.reduce(
                          (acc, row) =>
                            acc +
                            (row.needsAccommodation === "Yes" &&
                            row.gender === "Male"
                              ? 1
                              : 0) +
                            (parseInt(
                              row.numMaleAccompanyingNeedAccommodation
                            ) || 0),
                          0
                        )}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-bold">Female</p>
                      <p className="text-4xl font-bold">
                        {group.rows.reduce(
                          (acc, row) =>
                            acc +
                            (row.needsAccommodation === "Yes" &&
                            row.gender === "Female"
                              ? 1
                              : 0) +
                            (parseInt(
                              row.numFemaleAccompanyingNeedAccommodation
                            ) || 0),
                          0
                        )}
                      </p>
                    </div>
                    <div className="pt-2 bg-gray-100 p-2 px-8 rounded-2xl">
                      <p className="text-sm font-bold">Total</p>
                      <p className="text-4xl font-bold">
                        {group.rows.reduce(
                          (acc, row) =>
                            acc +
                            (row.needsAccommodation === "Yes" ? 1 : 0) +
                            (parseInt(
                              row.numMaleAccompanyingNeedAccommodation
                            ) || 0) +
                            (parseInt(
                              row.numFemaleAccompanyingNeedAccommodation
                            ) || 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <p className="text-2xl font-semibold">Loading...</p>
    </div>
  );
}
