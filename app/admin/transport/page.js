"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/app/_util/initApp";
import { getRegistrationData } from "@/app/_util/data";
import secureLocalStorage from "react-secure-storage";

export default function Transport() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);

    // const [dumpData, setDumpData] = useState(null);

    // filters.
    const [districts, setDistricts] = useState([]);
    const [filterDistrict, setFilterDistrict] = useState("");

    const [events, setEvents] = useState([]);
    const [filterEvent, setFilterEvent] = useState("");

    const [groups, setGroups] = useState([]);
    const [filterGroup, setFilterGroup] = useState("");

    const [modeOfTravelOptions, setModeOfTravelOptions] = useState([]);
    const [filterModeOfTravel, setFilterModeOfTravel] = useState("");

    const [modeOfTravelForDropOptions, setModeOfTravelForDropOptions] = useState([]);
    const [filterModeOfTravelForDrop, setFilterModeOfTravelForDrop] = useState("");

    const [checkInDateOptions, setCheckInDateOptions] = useState([]);
    const [filterCheckInDate, setFilterCheckInDate] = useState("");

    const [checkOutDateOptions, setCheckOutDateOptions] = useState([]);
    const [filterCheckOutDate, setFilterCheckOutDate] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filterNeedForPickup, setFilterNeedForPickup] = useState("");
    const [filterNeedForDrop, setFilterNeedForDrop] = useState("");
    const [filterNeedForAccommodation, setFilterNeedForAccommodation] = useState("");

    const [filterArrivalStartDate, setFilterArrivalStartDate] = useState(""); // Start date for Arrival
    const [filterArrivalEndDate, setFilterArrivalEndDate] = useState(""); // End date for Arrival

    const [filterDepartureStartDate, setFilterDepartureStartDate] = useState(""); // Start date for Departure
    const [filterDepartureEndDate, setFilterDepartureEndDate] = useState(""); // End date for Departure


    useEffect(() => {
        if (!secureLocalStorage.getItem('user')) {
            router.push('/');
        }

        const user = JSON.parse(secureLocalStorage.getItem('user'));
        setUser(user);
        getRegistrationData().then((_data) => {
            // Handle Logout.
            if (_data == null || _data.length != 8) {
                router.push('/');
            }

            setData(_data[0]);
            setFilteredData(_data[0]);
            // setDumpData(_data[0]);

            setDistricts(_data[1]);
            setEvents(_data[2]);
            setGroups(_data[3]);
            setModeOfTravelOptions(_data[4]);
            setModeOfTravelForDropOptions(_data[5]);
            setCheckInDateOptions(_data[6]);
            setCheckOutDateOptions(_data[7]);
        });
    }, [router]);


    useEffect(() => {
        if (data) {
            setFilteredData(
                data.filter((row) => {
                    const arrivalDate = new Date(row.arrivalDate);
                    const departureDate = new Date(row.departureDate);
                    
                    const arrivalStartDate = new Date(filterArrivalStartDate);
                    const arrivalEndDate = new Date(filterArrivalEndDate);
    
                    const departureStartDate = new Date(filterDepartureStartDate);
                    const departureEndDate = new Date(filterDepartureEndDate);
    
                    return (
                        // Exclude rows where modeOfTravelForDrop or modeOfTravelForPickup contains "Pickup not needed." or "Drop not needed."
                        !(
                            row.modeOfTravelForDrop &&
                            row.modeOfTravelForDrop.toLowerCase().includes("drop not needed.")
                        ) &&
                        !(
                            row.modeOfTravelForPickup &&
                            row.modeOfTravelForPickup.toLowerCase().includes("pickup not needed.")
                        ) &&
                        // Filtering logic for other conditions
                        (filterDistrict === "" || row.district === filterDistrict) &&
                        (filterEvent === "" || row.registeredEvents.includes(filterEvent)) &&
                        (filterGroup === "" || row.studentGroup === filterGroup) &&
                        (filterModeOfTravelForDrop === "" ||
                            (row.modeOfTravelForDrop &&
                            row.modeOfTravelForDrop.trim() !== "" &&
                            ["train", "bus"].includes(row.modeOfTravelForDrop.toLowerCase().trim()) &&
                            row.modeOfTravelForDrop.toLowerCase().trim() === filterModeOfTravelForDrop.toLowerCase().trim())) &&
                        (filterNeedForAccommodation === "" || (row.needsAccommodation.toString() === filterNeedForAccommodation)) &&
                        (filterCheckInDate === "" || row.checkInDate === filterCheckInDate) &&
                        (filterCheckOutDate === "" || row.checkOutDate === filterCheckOutDate) &&
                        // Filtering for Arrival Date range
                        (filterArrivalStartDate === "" || arrivalDate >= arrivalStartDate) &&
                        (filterArrivalEndDate === "" || arrivalDate <= arrivalEndDate) &&
                        // Filtering for Departure Date range
                        (filterDepartureStartDate === "" || departureDate >= departureStartDate) &&
                        (filterDepartureEndDate === "" || departureDate <= departureEndDate) &&
                        (searchQuery === "" ||
                            row.studentFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                })
            );
        }
    }, [
        data,
        filterDistrict,
        filterEvent,
        filterGroup,
        filterNeedForPickup,
        filterNeedForDrop,
        filterNeedForAccommodation,
        searchQuery,
        filterModeOfTravelForDrop,
        filterCheckInDate,
        filterCheckOutDate,
        filterArrivalStartDate, // Adding to the dependency array
        filterArrivalEndDate, // Adding to the dependency array
        filterDepartureStartDate, // Adding to the dependency array
        filterDepartureEndDate, // Adding to the dependency array
    ]);
    
       
    

    return user && filteredData ? (
        <>
            <div className="flex flex-col justify-center w-fit ml-auto mr-auto">
                <div className="rounded-2xl p-4 m-4 bg-white border overflow-x-auto justify-between flex flex-row">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                        <p className="text-gray-700">{user.email}</p>
                    </div>
                    <div className="flex flex-row">
                        <button
                            className="bg-[#fffece] text-[#2c350b] font-bold px-4 py-1 rounded-xl mr-2"
                            onClick={() => router.push('/admin')}
                        >
                            Dashboard
                        </button>

                        <button
                            className="bg-[#ffcece] text-[#350b0b] font-bold px-4 py-1 rounded-xl"
                            onClick={() => {
                                auth.signOut();
                                secureLocalStorage.clear();
                                router.push('/');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-4 m-4 justify-center overflow-x-auto">
                    <div className="bg-white p-4 rounded-2xl border w-full">
                        <div className="flex flex-col gap-4">
                            <div>
                                <input
                                    id="search"
                                    className="border pt-2 pb-2 pl-4 rounded-2xl w-full"
                                    placeholder="Search by name or student ID"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-row gap-8 items-center">
                                <div className="flex flex-col flex-grow">
                                    <label htmlFor="district" className="mb-2"><b>District</b></label>
                                    <select
                                        id="district"
                                        className="border p-2 rounded-2xl"
                                        value={filterDistrict}
                                        onChange={(e) => setFilterDistrict(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {districts.map((district, index) => (
                                            <option key={index} value={district}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <label htmlFor="event" className="mb-2"><b>Event</b></label>
                                    <select
                                        id="event"
                                        className="border p-2 rounded-2xl"
                                        value={filterEvent}
                                        onChange={(e) => setFilterEvent(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {events.map((event, index) => (
                                            <option key={index} value={event}>{event}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <label htmlFor="group" className="mb-2"><b>Group</b></label>
                                    <select
                                        id="group"
                                        className="border p-2 rounded-2xl"
                                        value={filterGroup}
                                        onChange={(e) => setFilterGroup(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {groups.map((group, index) => (
                                            <option key={index} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row m-4 gap-4 items-center">
                    <div className="bg-white p-4 rounded-2xl border flex-grow">
                        <div className="flex flex-row flex-wrap justify-between gap-2">
                            <div className="flex flex-col justify-between gap-2">
                                <label htmlFor="modeOfTravelForDrop"><b>Mode Of Transport</b></label>
                                <select
                                    id="modeOfTravelForDrop"
                                    className="border p-2 rounded-2xl w-60"
                                    value={filterModeOfTravelForDrop}
                                    onChange={(e) => setFilterModeOfTravelForDrop(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {modeOfTravelOptions.map((mode, index) => (
                                        <option key={index} value={mode}>{mode}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border flex-grow">
                        <div className="flex flex-row flex-wrap justify-between gap-2">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="checkInStartDate"><b>Arrival Date Range</b></label>
                                <input
                                    type="date"
                                    id="checkInStartDate"
                                    className="border p-2 rounded-2xl"
                                    value={filterArrivalStartDate}
                                    onChange={(e) => setFilterArrivalStartDate(e.target.value)}
                                />
                                <input
                                    type="date"
                                    id="checkInEndDate"
                                    className="border p-2 rounded-2xl"
                                    value={filterArrivalEndDate}
                                    onChange={(e) => setFilterArrivalEndDate(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="checkOutStartDate"><b>Departure Date Range</b></label>
                                <input
                                    type="date"
                                    id="checkOutStartDate"
                                    className="border p-2 rounded-2xl"
                                    value={filterDepartureStartDate}
                                    onChange={(e) => setFilterDepartureStartDate(e.target.value)}
                                />
                                <input
                                    type="date"
                                    id="checkOutEndDate"
                                    className="border p-2 rounded-2xl"
                                    value={filterDepartureEndDate}
                                    onChange={(e) => setFilterDepartureEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-row flex-wrap gap-4 m-4 justify-center overflow-x-auto">
                    <div className="bg-white p-4 rounded-2xl border flex flex-col justify-between">
                        <div>
                            <p className="text-lg font-bold">Total Registrations</p>
                            <p className="text-sm font-semibold text-gray-500">Participants</p>
                        </div>
                        <div className="flex justify-around gap-3">
                            <div className="pt-2">
                                <p className="text-sm font-bold">Male</p>
                                <p className="text-4xl font-bold">{filteredData.reduce((acc, row) => acc + parseInt((row.gender == "Male" ? 1 : 0) ?? 0), 0)}</p>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm font-bold">Female</p>
                                <p className="text-4xl font-bold">{filteredData.reduce((acc, row) => acc + parseInt((row.gender == "Female" ? 1 : 0) ?? 0), 0)}</p>
                            </div>
                            <div className="pt-2 bg-gray-100 p-2 px-8 rounded-2xl">
                                <p className="text-sm font-bold">Total</p>
                                <p className="text-4xl font-bold">
                                    {filteredData.reduce((acc, row) => acc + parseInt((row.gender == "Male" ? 1 : 0) ?? 0), 0) + filteredData.reduce((acc, row) => acc + parseInt((row.gender == "Female" ? 1 : 0) ?? 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto m-4">
                    <table className="table-auto w-full mt-6 border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="px-4 py-2 border">Student Details</th>
                                <th className="px-4 py-2 border">BalVikas Details</th>
                                <th className="px-4 py-2 border">Arrival & Departure Logistics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index} className={`${row.overallRegistrationStatus === "Accepted" ? "bg-white" : "bg-red-200"} hover:bg-blue-50 text-bold transition duration-200`}>
                                    <td className="px-4 py-2 border max-w-[160px]">
                                        <p className="font-bold">{row.studentFullName ?? "-"}</p>
                                        <p className="text-xs">{row.gender ?? "-"} - {row.dateOfBirth ?? "-"}</p>
                                        <div className="flex flex-wrap gap-1 mt-3 mb-2">
                                            <p className="text-xs font-bold bg-[#c4ffc2] text-[#07210d] p-1 px-2 rounded-2xl w-fit">{row.studentId ?? "-"}</p>
                                            <p className="text-xs font-bold bg-[#bad1ff] text-[#090e2d] p-1 px-2 rounded-2xl w-fit">{row.studentGroup ?? "-"}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border max-w-[200px]">
                                        <p className="font-bold">{row.district ?? "-"}</p>
                                        <p className="text-xs">{row.samithiName ?? '-'}</p>
                                        <p className="text-xs">DOJ BV: {row.dateOfJoiningBalvikas ?? '-'} {row.yearOfJoiningBalvikas ?? '-'}</p>
                                        {row.studentGroup === 'Group 3' && (
                                            <p className="text-xs">Passed group 2: {row.hasPassedGroup2Exam ?? '-'}</p>
                                        )}
                                        <div className="flex flex-wrap mt-2 gap-1">
                                            {row.registeredEvents.map((event, index) => (
                                                <p key={index} className="text-xs bg-green-200 text-green-800 font-bold rounded-xl p-1 px-2 w-fit">{event ?? "-"}</p>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border max-w-[200px]">
                                        <div className="flex flex-col justify-around items-center gap-4 mt-2 mb-2">
                                            <div className="border rounded-2xl p-2 w-60">
                                                <p className="text-xs font-semibold">{"Arrival"}</p>
                                                <p className="text-xs font-bold">{row.arrivalDate ?? "-"} - {row.arrivalTime ?? "-"}</p>
                                                <p className="text-xs">{row.needsPickup === "Yes" ? "Needs pickup." : "Pickup not needed."}</p>
                                                {row.needsPickup === "Yes" && (
                                                    <div className="bg-purple-100 p-2 rounded-xl mt-2">
                                                        <p className="text-xs">Mode: {row.modeOfTravel ?? "-"}</p>
                                                        <p className="text-xs">Pickup Point: {row.pickupPoint ?? "-"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="border rounded-2xl p-2 w-60">
                                                <p className="text-xs font-semibold">{"Departure"}</p>
                                                <p className="text-xs font-bold">{row.departureDate ?? "-"} - {row.departureTime ?? "-"}</p>
                                                <p className="text-xs">{row.needsDrop === "Yes" ? "Needs drop." : "Drop not needed."}</p>
                                                {row.needsDrop === "Yes" && (
                                                    <div className="bg-purple-100 p-2 rounded-xl mt-2">
                                                        <p className="text-xs">Mode: {row.modeOfTravelForDrop ?? "-"}</p>
                                                        <p className="text-xs">Drop Point: {row.dropOffPoint ?? "-"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p className="text-2xl font-semibold">Loading...</p>
        </div>
    )

}