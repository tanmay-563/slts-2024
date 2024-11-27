"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../_util/initApp";
import { getRegistrationData } from "../_util/data";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) {
            router.push('/');
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.role !== 'admin') {
                router.push('/');
            } else {
                setUser(user);
                getRegistrationData().then((_data) => {
                    // Handle Logout.
                    if (_data == null) {
                        router.push('/');
                    }
                    console.log(Object.keys(_data[0]));
                    setData(_data);
                });
            }
        }
    }, [router]);



    return user && data ? (
        <>
            <div className="rounded-lg p-6 m-4 bg-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
                <p className="text-gray-700 mb-4">{user.email}</p>
            </div>
            <div className="overflow-x-auto m-4">
                <table className="table-auto w-full mt-6 border-collapse shadow-lg">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="px-4 py-2 border">Student Details</th>
                            <th className="px-4 py-2 border">BalVikas Details</th>
                            <th className="px-4 py-2 border">Arrival & Departure Logistics</th>
                            <th className="px-4 py-2 border">Accompany Details</th>
                            <th className="px-4 py-2 border">Accommodation Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="bg-white hover:bg-blue-50 text-bold transition duration-200">
                                <td className="px-4 py-2 border max-w-[160px]">
                                    <p className="font-bold">{row.studentFullName ?? "-"}</p>
                                    <p className="text-xs">{row.gender ?? "-"} - {row.dateOfBirth ?? "-"}</p>
                                    <p className="text-xs font-bold bg-[#bad1ff] text-[#090e2d] p-1 rounded-2xl w-fit">{row.studentGroup ?? "-"}</p>
                                </td>
                                <td className="px-4 py-2 border max-w-[200px]">
                                    <p className="font-bold">{row.district ?? "-"}</p>
                                    <p className="text-xs">{row.samithiName ?? '-'}</p>
                                    <p className="text-xs">DOJ BV: {row.dateOfJoiningBalvikas ?? '-'} {row.yearOfJoiningBalvikas ?? '-'}</p>
                                    {row.studentGroup === 'Group 3' && (
                                        <p className="text-xs">Passed group 2: {row.hasPassedGroup2Exam ?? '-'}</p>
                                    )}
                                    <div className="flex flex-wrap mt-2">
                                        {row.registeredEvents.map((event, index) => (
                                            <p key={index} className="text-xs bg-green-200 text-green-800 font-bold rounded-xl p-1 px-2 w-fit">{event ?? "-"}</p>
                                        ))}
                                    </div>
                                </td>
                                <td className="border max-w-[200px]">
                                    <div className="flex flex-row justify-around items-center gap-1">
                                        <div className="border rounded-2xl p-2">
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
                                        <div className="border rounded-2xl p-2">
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
                                <td className="px-4 py-2 border">
                                    <p className="text-xs">{row.hasAccompanyingAdults === "Yes" ? "Has Accompanying adults." : "No Accompany."}</p>
                                    <div className="mt-2 bg-purple-100 p-2 rounded-2xl">
                                        <p className="text-xs font-bold">{row.accompanyingPersonName ?? "-"}</p>
                                        <p className="text-xs">{row.accompanyingPersonGender ?? "-"} - {row.accompanyingPersonAge ?? "-"} yrs</p>
                                        <p className="text-xs">{row.accompanyingPersonRelation ?? "-"}</p>
                                        <p className="text-xs">{row.accompanyingPersonContact ?? "-"}</p>
                                        <div className="flex gap-1 flex-wrap mt-2">
                                            <p className="text-xs">{row.numMaleAccompanying ?? "0"} male</p>
                                            <p className="text-xs">{row.numFemaleAccompanying ?? "0"} female</p>
                                            <p className="text-xs">{row.numNonParticipatingSiblings ?? "0"} children</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="mt-2 bg-purple-100 p-2 rounded-2xl">
                                        <p className="text-xs font-bold">Check-In Details</p>
                                        <p className="text-xs">{row.checkInDate ?? "-"} - {row.checkInTime ?? "-"}</p>
                                        <p className="text-xs">{row.checkOutDate ?? "-"} - {row.checkOutTime ?? "-"}</p>
                                        <p className="text-xs">For student: {row.needsAccommodation ?? "-"}</p>

                                        <div className="flex gap-1 flex-wrap mt-2">
                                            <p className="text-xs">{row.numMaleAccompanyingNeedAccommodation ?? "0"} male</p>
                                            <p className="text-xs">{row.numFemaleAccompanyingNeedAccommodation ?? "0"} female</p>
                                        </div>
                                        <p className="text-xs">Allergies: {row.foodAllergies ?? "-"}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <div className="flex h-screen items-center justify-center">Loading...</div>
    )

}