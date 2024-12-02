"use client";

import { getJudgeGroupEventData } from "@/app/_util/data";
import { auth } from "@/app/_util/initApp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function JudgeGroupPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [eventMetadata, setEventMetadata] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [filteredParticipants, setFilteredParticipants] = useState(null);

    const [scoreBuffer, setScoreBuffer] = useState([]);
    const [scoreMode, setScoreMode] = useState({});

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!secureLocalStorage.getItem('user')) {
            router.push('/');
        }

        const user = JSON.parse(secureLocalStorage.getItem('user'));
        if (user.role !== 'judge' || !user.event) {
            router.push('/');
        } else {
            setUser(user);
            getJudgeGroupEventData(user.event).then((_data) => {
                if (_data == null || _data.length != 2) {
                    router.push('/');
                }

                setParticipants(_data[0]);
                setEventMetadata(_data[1]);
            });
        }
    }, [router]);

    return user && eventMetadata && participants ? (
        <>
            <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                <div className="rounded-2xl p-4 m-2 bg-white border overflow-x-auto justify-between flex flex-row">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                        <p className="text-gray-700 mt-2">{user.email}</p>
                        <p className="font-bold">{user.event}</p>
                    </div>
                    <div>
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

                <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                    <div className="rounded-2xl p-4 bg-white border overflow-x-auto">
                        <h1 className="text-2xl font-bold">{eventMetadata.name}</h1>
                        <p className="text-md">{participants.length} Participants</p>
                        <div className="flex flex-row flex-wrap gap-1 mt-1">
                            {eventMetadata.group.map((group, index) => (
                                <p key={index} className="bg-gray-200 text-gray-800 font-semibold px-2 py-1 rounded-xl w-fit">
                                    {group}
                                </p>
                            ))}
                        </div>

                        {/* Evaluation Criteria */}
                        <h2 className="text-xl font-bold mt-6">Evaluation Criteria</h2>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Criteria</th>
                                    <th className="border px-4 py-2">Max Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(eventMetadata.evalCriteria).map(([key, value], index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{key}</td>
                                        <td className="border px-4 py-2">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                    <div className="rounded-2xl p-4 my-4 bg-white border overflow-x-auto">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl font-bold">Participants</h1>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {Object.entries(participants).map(([_, val], index) => (
                                <div key={index} className="rounded-2xl px-4 bg-gray-100 border">
                                    <div className="flex flex-col">
                                        {val.map((participant, index) => (
                                            <div className="mt-4" key={index}>
                                                <div className="flex flex-row justify-between">
                                                    <div>
                                                        <h2 className="text-xl font-bold">{participant.studentId}</h2>
                                                        <p className="text-xs">{participant.gender ?? "-"} - {participant.dateOfBirth ?? "-"}</p>
                                                        <p className="text-xs rounded-2xl w-fit">{participant.studentGroup ?? "-"}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl font-semibold">Loading...</p>
        </div>
    )
}