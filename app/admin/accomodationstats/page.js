"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/_util/initApp";
import { getRegistrationData } from "@/app/_util/data";
import secureLocalStorage from "react-secure-storage";

export default function DistrictStats() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [filterDistrict, setFilterDistrict] = useState(""); // initialize with empty string for filtering

  const [checkInDateOptions, setCheckInDateOptions] = useState([]);
  const [checkInData, setCheckInData] = useState([]);

  const [checkOutDateOptions, setCheckOutDateOptions] = useState([]);
  const [filterCheckOutDate, setFilterCheckOutDate] = useState("");

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

      // Set state with fetched data
      setData(_data[0]);
      setDistricts(_data[1]);
      setCheckInDateOptions(_data[6]);
      setCheckOutDateOptions(_data[7]);

      // Organize and sort data
      const organizedData = _data[6].map((checkInDate) => ({
        checkInDate: checkInDate,
        rows: _data[0].filter((row) => row.checkInDate === checkInDate),
      }));

      organizedData.forEach((item) => {
        item.rows.sort((a, b) => {
          const dateA = new Date(a.pickUpTime);
          const dateB = new Date(b.pickUpTime);

          return dateA - dateB;
        });
      });
      setFilteredData(organizedData);
      setCheckInData(organizedData);
      console.log("Organized Data:", organizedData);
    });
  }, [router]);

  useEffect(() => {
    // Filtering the data when district or checkout date changes
    const filtered = checkInData.map((item) => ({
      checkInDate: item.checkInDate,
      rows: item.rows.filter(
        (row) =>
          (filterDistrict === "" || row.district === filterDistrict) &&
          (filterCheckOutDate === "" || row.checkOutDate === filterCheckOutDate)
      ),
    }));

    setFilteredData(filtered);
  }, [checkInData, filterDistrict, filterCheckOutDate]);

  return user && data ? (
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

      {/* District Dropdown */}
      <div>
        <label htmlFor="District">
          <b>District</b>
        </label>
        <select
          id="District"
          className="border p-2 rounded-2xl"
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)} // handle district change
        >
          <option value="">All</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Rendering Filtered Data */}
      {filteredData.map(({ checkInDate, rows }, index) => (
        <div key={index}>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {checkInDate}
          </h1>
          <div className="bg-white p-4 rounded-2xl border flex flex-col justify-between">
            <p className="text-lg font-bold">Accommodation</p>
            <div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Overall</p>
              </div>
              <div className="flex justify-around gap-3">
                <div className="pt-2">
                  <p className="text-sm font-bold">Male</p>
                  <p className="text-4xl font-bold">
                    {rows.reduce(
                      (acc, row) =>
                        acc +
                        parseInt(
                          (row.needsAccommodation == "Yes" &&
                          row.gender == "Male"
                            ? 1
                            : 0) ?? 0
                        ),
                      0
                    ) +
                      rows.reduce(
                        (acc, row) =>
                          acc +
                          parseInt(
                            row.numMaleAccompanyingNeedAccommodation ?? 0
                          ),
                        0
                      )}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold">Female</p>
                  <p className="text-4xl font-bold">
                    {rows.reduce(
                      (acc, row) =>
                        acc +
                        parseInt(
                          (row.needsAccommodation == "Yes" &&
                          row.gender == "Female"
                            ? 1
                            : 0) ?? 0
                        ),
                      0
                    ) +
                      rows.reduce(
                        (acc, row) =>
                          acc +
                          parseInt(
                            row.numFemaleAccompanyingNeedAccommodation ?? 0
                          ),
                        0
                      )}
                  </p>
                </div>
                <div className="pt-2 bg-gray-100 p-2 px-8 rounded-2xl">
                  <p className="text-sm font-bold">Total</p>
                  <p className="text-4xl font-bold">
                    {rows.reduce(
                      (acc, row) =>
                        acc +
                        parseInt(
                          (row.needsAccommodation == "Yes" &&
                          row.gender == "Male"
                            ? 1
                            : 0) ?? 0
                        ),
                      0
                    ) +
                      rows.reduce(
                        (acc, row) =>
                          acc +
                          parseInt(
                            (row.needsAccommodation == "Yes" &&
                            row.gender == "Female"
                              ? 1
                              : 0) ?? 0
                          ),
                        0
                      ) +
                      rows.reduce(
                        (acc, row) =>
                          acc +
                          parseInt(
                            row.numMaleAccompanyingNeedAccommodation ?? 0
                          ),
                        0
                      ) +
                      rows.reduce(
                        (acc, row) =>
                          acc +
                          parseInt(
                            row.numFemaleAccompanyingNeedAccommodation ?? 0
                          ),
                        0
                      )}
                  </p>
                </div>
              </div>
            </div>
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
