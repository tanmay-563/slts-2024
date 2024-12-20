"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { getJudgeEventData, markScore } from "@/app/_util/data";
import { auth } from "@/app/_util/initApp";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function JudgePage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [eventMetadata, setEventMetadata] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [filteredParticipants, setFilteredParticipants] = useState(null);

    const [scoreBuffer, setScoreBuffer] = useState([]);
    const [commentBuffer, setCommentBuffer] = useState("");
    const [scoreMode, setScoreMode] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [additionalFields, setAdditionalFields] = useState(false); // State to track if additional fields are added
    const [isNewSelected, setIsNewSelected] = useState(false); // State to track if "New" is clicked

    const [studentId, setStudentId] = useState("");
    const [groupNumber, setGroupNumber] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");

    const addNewFields = () => {
        if (!additionalFields) {
            setAdditionalFields(true); // Add additional fields when clicked
        }
        setIsNewSelected(true); // Make "New" button active
    };

    const handleAlreadyExist = () => {
        setAdditionalFields(false); // Remove additional fields when clicked
        setIsNewSelected(false); // Revert "New" button style
    };

    const handleInputChange = (e, field) => {
        switch (field) {
            case "studentId":
                setStudentId(e.target.value);
                break;
            case "groupNumber":
                setGroupNumber(e.target.value);
                break;
            case "dob":
                setDob(e.target.value);
                break;
            case "gender":
                setGender(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleSubmitSubstitution = () => {
        const updatedParticipants = participants.map((participant) => {
            if (participant.studentId === studentId) {
                return {
                    ...participant,
                    groupNumber,
                    dob,
                    gender,
                };
            }
            return participant;
        });
        setParticipants(updatedParticipants); // Update participants list
        setIsOpen(false); // Close dialog
        setStudentId("");
        setGroupNumber("");
        setDob("");
        setGender("");
        setIsOpen(false);
    };


    useEffect(() => {
        if (participants) {
            setFilteredParticipants(
                participants.filter((participant) => {
                    return (
                        searchQuery == "" ||
                        participant.studentId
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    );
                })
            );
        }
    }, [searchQuery, participants]);

    useEffect(() => {
        if (!secureLocalStorage.getItem("user")) {
            router.push("/");
        }

        const user = JSON.parse(secureLocalStorage.getItem("user"));
        if (user.role !== "judge" || !user.event) {
            router.push("/");
        } else {
            setUser(user);
            getJudgeEventData(user.event).then((_data) => {
                if (_data == null || _data.length != 2) {
                    router.push("/");
                }

                let _scoreMode = {};
                _data[0].forEach((participant) => {
                    _scoreMode[participant.studentId] = false;
                });
                setScoreMode(_scoreMode);
                setEventMetadata(_data[1]);
                setParticipants(_data[0]);
                setFilteredParticipants(_data[0]);
            });
        }
    }, [router]);

    return user && eventMetadata && participants && filteredParticipants ? (
        <>
            <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                <div className="rounded-2xl p-4 m-2 bg-white border overflow-x-auto justify-between flex flex-row">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                        <p className="text-gray-700 mt-2">{user.email}</p>
                        <p className="text-gray-700">
                            Judge for <span className="font-bold">{user.event}</span>
                        </p>
                    </div>
                    <div>
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
                </div>

                {/* Design mobile-friendly */}
                <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                    <div className="rounded-2xl p-4 bg-white border overflow-x-auto">
                        <h1 className="text-2xl font-bold">{eventMetadata.name}</h1>
                        <p className="text-md">{participants.length} Participants</p>
                        <div className="flex flex-row flex-wrap gap-1 mt-1">
                            {eventMetadata.group.map((group, index) => (
                                <p
                                    key={index}
                                    className="bg-gray-200 text-gray-800 font-semibold px-2 py-1 rounded-xl w-fit"
                                >
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
                                {Object.entries(eventMetadata.evalCriteria).map(
                                    ([key, value], index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{key}</td>
                                            <td className="border px-4 py-2">{value}</td>
                                        </tr>
                                    )
                                )}
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Total</td>
                                    <td className="border px-4 py-2 font-semibold">
                                        {Object.values(eventMetadata.evalCriteria).reduce(
                                            (a, b) => a + b,
                                            0
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Participants as cards */}
                <div className="flex flex-col justify-center w-fit min-w-[95%] ml-auto mr-auto">
                    <div className="rounded-2xl p-4 my-4 bg-white border overflow-x-auto">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl font-bold">Participants</h1>
                        </div>

                        {/* Search bar */}
                        <div className="flex flex-row justify-between items-center mt-4">
                            <input
                                type="text"
                                placeholder="Enter Participant ID"
                                className="border p-2 rounded-lg w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {filteredParticipants.map((participant, index) => (
                                <div key={index} className="rounded-2xl p-4 bg-gray-100 border">
                                    <div className="flex flex-row justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {participant.studentId}
                                            </h2>
                                            <p className="text-xs">
                                                {participant.gender ?? "-"} -{" "}
                                                {participant.dateOfBirth ?? "-"}
                                            </p>
                                            <p className="text-xs mt-2 font-bold bg-[#bad1ff] text-[#090e2d] p-1 px-2 rounded-2xl w-fit">
                                                {participant.studentGroup ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            {participant.score &&
                                                participant.score[eventMetadata.name] &&
                                                participant.score[eventMetadata.name][user.id] ? (
                                                <div className="mt-2 flex flex-col">
                                                    <button
                                                        className="bg-[#cceeff] text-[#003366] font-semibold px-4 py-1 rounded-xl mt-2"
                                                        onClick={() => setIsOpen(true)}
                                                    >
                                                        Substitute
                                                    </button>

                                                    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 shadow-2xl">
                                                        <div className="fixed inset-0 flex w-screen items-center justify-center p-2 overflow-y-auto backdrop-blur-sm">
                                                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle transition-all border">
                                                                <div className="flex flex-row justify-between my-2">
                                                                    <Dialog.Title className="text-sm font-medium text-gray-900 w-[70%]">Reason for not participating in the event</Dialog.Title>
                                                                    <button
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="bg-gray-200 p-1 rounded-full"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="black"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    placeholder="Type here...."
                                                                    className="border p-2 rounded-2xl w-full"
                                                                ></textarea>

                                                                <div className="mt-4">
                                                                    <p className="font-semibold">Add Substitute</p>
                                                                    <div className="flex flex-row justify-between">
                                                                        <button
                                                                            className={`font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50 ${isNewSelected ? 'bg-black text-white' : 'border border-black'}`}
                                                                            onClick={addNewFields}
                                                                        >
                                                                            New
                                                                        </button>
                                                                        <button
                                                                            className={`font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50 ${!isNewSelected ? 'bg-black text-white' : 'border border-black'}`}
                                                                            onClick={handleAlreadyExist}
                                                                        >
                                                                            Already Exist
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-6">
                                                                    <p className="text-xs mx-2 mt-2">Please enter the student details below</p>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Student ID"
                                                                        value={studentId}
                                                                        onChange={(e) => handleInputChange(e, "studentId")}
                                                                        className="border p-2 rounded-2xl w-full mt-2"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Group Number"
                                                                        value={groupNumber}
                                                                        onChange={(e) => handleInputChange(e, "groupNumber")}
                                                                        className="border p-2 rounded-2xl w-full mt-2"
                                                                    />

                                                                    {/* Render additional fields dynamically */}
                                                                    {additionalFields && (
                                                                        <div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Date of Birth"
                                                                                value={dob}
                                                                                onChange={(e) => handleInputChange(e, "dob")}
                                                                                className="border p-2 rounded-2xl w-full mt-2"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Gender"
                                                                                value={gender}
                                                                                onChange={(e) => handleInputChange(e, "gender")}
                                                                                className="border p-2 rounded-2xl w-full mt-2"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-row justify-between mt-2">
                                                                    <button className="bg-[#ffcece] text-[#350b0b] font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50"
                                                                        disabled={isLoading}
                                                                        onClick={() => {
                                                                            setIsOpen(false);
                                                                        }}>
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={handleSubmitSubstitution}
                                                                        disabled={isLoading || !studentId || !groupNumber || !dob || !gender}
                                                                        className="bg-[#dcceff] text-[#270b35] font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50"
                                                                    >
                                                                        {isLoading ? "Submitting ..." : "Submit"}
                                                                    </button>
                                                                </div>
                                                            </DialogPanel>
                                                        </div>
                                                    </Dialog>
                                                    <button
                                                        className="bg-[#ffcece] text-[#350b0b] font-semibold px-4 py-1 rounded-xl mt-2"
                                                        onClick={() => {
                                                            let _scoreMode = {};
                                                            participants.forEach((p) => {
                                                                _scoreMode[p.studentId] = false;
                                                            });
                                                            _scoreMode[participant.studentId] = true;

                                                            setScoreBuffer(
                                                                Object.entries(
                                                                    participant.score[eventMetadata.name][user.id]
                                                                ).map(([key, val]) => [key, val])
                                                            );

                                                            setScoreMode(_scoreMode);
                                                            setCommentBuffer(
                                                                participant.comment[eventMetadata.name][
                                                                user.id
                                                                ] ?? ""
                                                            );
                                                        }}
                                                    >
                                                        Edit Score
                                                    </button>
                                                </div>
                                            ) : scoreMode[participant.studentId] == false ? (
                                                <div className="flex flex-col justify-between">
                                                    <button
                                                        className="bg-[#cceeff] text-[#003366] font-semibold px-4 py-1 rounded-xl mt-2"
                                                        onClick={() => setIsOpen(true)}
                                                    >
                                                        Substitute
                                                    </button>

                                                    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 shadow-2xl">
                                                        <div className="fixed inset-0 flex w-screen items-center justify-center p-2 overflow-y-auto backdrop-blur-sm">
                                                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle">
                                                                <div className="flex flex-row justify-between my-2">
                                                                    <DialogTitle className="text-sm font-medium text-gray-900 w-[70%]">Reason for not participating in the event</DialogTitle>
                                                                    <button
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="bg-gray-200 p-1 rounded-full"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="black"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    placeholder="Type here...."
                                                                    className="border p-2 rounded-2xl w-full"
                                                                ></textarea>

                                                                <div className="mt-4">
                                                                    <p className="font-semibold">Add Substitute</p>
                                                                    <div className="flex flex-row justify-between">
                                                                        <button
                                                                            className={`font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50 ${isNewSelected ? 'bg-black text-white' : 'border border-black'}`}
                                                                            onClick={addNewFields}
                                                                        >
                                                                            New
                                                                        </button>
                                                                        <button
                                                                            className={`font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50 ${!isNewSelected ? 'bg-black text-white' : 'border border-black'}`}
                                                                            onClick={handleAlreadyExist}
                                                                        >
                                                                            Already Exist
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-6">
                                                                    <p className="text-xs mx-2 mt-2">Please enter the student details below</p>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Student ID"
                                                                        value={studentId}
                                                                        onChange={(e) => handleInputChange(e, "studentId")}
                                                                        className="border p-2 rounded-2xl w-full mt-2"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Group Number"
                                                                        value={groupNumber}
                                                                        onChange={(e) => handleInputChange(e, "groupNumber")}
                                                                        className="border p-2 rounded-2xl w-full mt-2"
                                                                    />

                                                                    {/* Render additional fields dynamically */}
                                                                    {additionalFields && (
                                                                        <div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Date of Birth"
                                                                                value={dob}
                                                                                onChange={(e) => handleInputChange(e, "dob")}
                                                                                className="border p-2 rounded-2xl w-full mt-2"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Gender"
                                                                                value={gender}
                                                                                onChange={(e) => handleInputChange(e, "gender")}
                                                                                className="border p-2 rounded-2xl w-full mt-2"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-row justify-between mt-2">
                                                                    <button className="bg-[#ffcece] text-[#350b0b] font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50"
                                                                        disabled={isLoading}
                                                                        onClick={() => {
                                                                            setIsOpen(false);
                                                                        }}>
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={handleSubmitSubstitution}
                                                                        disabled={isLoading || !studentId || !groupNumber || !dob || !gender}
                                                                        className="bg-[#dcceff] text-[#270b35] font-bold px-4 py-1 rounded-xl mr-2 my-2 w-full disabled:opacity-50"
                                                                    >
                                                                        {isLoading ? "Submitting ..." : "Submit"}
                                                                    </button>
                                                                </div>
                                                            </DialogPanel>
                                                        </div>
                                                    </Dialog>

                                                    <button
                                                        className="bg-[#ffd8a1] text-[#35250b] font-semibold px-4 py-1 rounded-xl mt-2"
                                                        onClick={() => {
                                                            let _scoreMode = {};
                                                            participants.forEach((p) => {
                                                                _scoreMode[p.studentId] = false;
                                                            });
                                                            _scoreMode[participant.studentId] = true;
                                                            setScoreBuffer(
                                                                Object.entries(eventMetadata.evalCriteria).map(
                                                                    ([key, _]) => [key, 0]
                                                                )
                                                            );
                                                            setScoreMode(_scoreMode);
                                                            setCommentBuffer("");
                                                        }}
                                                    >
                                                        Evaluate
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="bg-[#a1fffd] text-[#0b3533] font-semibold px-4 py-1 rounded-xl mt-2">
                                                    Evaluating
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {scoreMode[participant.studentId] &&
                                        eventMetadata.evalCriteria ? (
                                        <>
                                            <hr className="my-4" />
                                            <div className="flex flex-col gap-2 justify-center items-stretch align-middle">
                                                {scoreBuffer.map(([key, val], index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-row justify-between items-center"
                                                    >
                                                        <label className="text-sm">{key}</label>
                                                        <input
                                                            type="number"
                                                            className="border p-2 rounded-lg text-md"
                                                            max={eventMetadata.evalCriteria[key]}
                                                            min={0}
                                                            value={val}
                                                            onChange={(e) => {
                                                                const newBuffer = [...scoreBuffer];
                                                                newBuffer[index][1] = e.target.value;
                                                                setScoreBuffer(newBuffer);
                                                            }}
                                                        />
                                                    </div>
                                                ))}

                                                <hr className="border-dashed mt-2" />
                                                <div className="flex flex-row justify-between align-middle">
                                                    <label className="text-sm">Total</label>
                                                    <p className="text-md font-semibold">
                                                        {scoreBuffer.reduce(
                                                            (a, b) =>
                                                                (a == "" ? 0 : a) +
                                                                parseInt(b[1] == "" ? 0 : b[1]),
                                                            0
                                                        )}
                                                    </p>
                                                </div>

                                                <hr className="border-dashed" />
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-sm">Comments (Optional)</label>
                                                    <textarea
                                                        className="border p-2 rounded-lg"
                                                        value={commentBuffer}
                                                        onChange={(e) => setCommentBuffer(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex flex-row justify-between gap-1">
                                                    <button
                                                        className="bg-[#ffe0e0] text-[#350b0b] font-semibold px-4 py-1 rounded-xl mt-2 w-full disabled:opacity-50"
                                                        disabled={isSaving}
                                                        onClick={() => {
                                                            setScoreBuffer([]);

                                                            let _scoreMode = {};
                                                            participants.forEach((p) => {
                                                                _scoreMode[p.studentId] = false;
                                                            });
                                                            setScoreMode(_scoreMode);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="bg-[#c2fca2] text-[#0b350d] font-semibold px-4 py-1 rounded-xl mt-2 w-full disabled:opacity-50"
                                                        disabled={isSaving}
                                                        onClick={() => {
                                                            setIsSaving(true);
                                                            markScore(
                                                                participant.studentId,
                                                                eventMetadata.name,
                                                                user.id,
                                                                Object.fromEntries(scoreBuffer),
                                                                commentBuffer
                                                            ).then((res) => {
                                                                if (res) {
                                                                    let _scoreMode = {};
                                                                    participants.forEach((p) => {
                                                                        _scoreMode[p.studentId] = false;
                                                                    });
                                                                    setScoreMode(_scoreMode);

                                                                    let _participants = [...participants];
                                                                    const i = _participants.findIndex(
                                                                        (p) => p.studentId == participant.studentId
                                                                    );
                                                                    _participants[i].score =
                                                                        _participants[i].score ?? {};
                                                                    _participants[i].score[eventMetadata.name] =
                                                                        _participants[i].score[
                                                                        eventMetadata.name
                                                                        ] ?? {};
                                                                    _participants[i].score[eventMetadata.name][
                                                                        user.id
                                                                    ] = {};
                                                                    scoreBuffer.forEach(([key, val]) => {
                                                                        _participants[i].score[eventMetadata.name][
                                                                            user.id
                                                                        ][key] = val;
                                                                    });

                                                                    _participants[i].comment =
                                                                        _participants[i].comment ?? {};
                                                                    _participants[i].comment[eventMetadata.name] =
                                                                        _participants[i].comment[
                                                                        eventMetadata.name
                                                                        ] ?? {};
                                                                    _participants[i].comment[eventMetadata.name][
                                                                        user.id
                                                                    ] = commentBuffer;

                                                                    setParticipants(_participants);
                                                                }

                                                                setIsSaving(false);
                                                            }).catch((_) => {
                                                                alert("An error occurred. Please try again.");
                                                                setIsSaving(false);
                                                            });
                                                        }}
                                                    >
                                                        {isSaving ? "Saving..." : "Save"}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : participant.score &&
                                        participant.score[eventMetadata.name] &&
                                        participant.score[eventMetadata.name][user.id] ? (
                                        <div className="flex flex-col gap-2 mt-4">
                                            <hr />
                                            <h2 className="text-lg font-bold">Score</h2>
                                            {Object.entries(
                                                participant.score[eventMetadata.name][user.id]
                                            ).map(([key, val], index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-row justify-between items-center"
                                                >
                                                    <label className="text-sm">{key}</label>
                                                    <p className="text-md font-semibold">{val}</p>
                                                </div>
                                            ))}
                                            <hr className="border-dashed" />
                                            <div className="flex flex-row justify-between items-center">
                                                <label className="text-sm">Total</label>
                                                <p className="text-md font-semibold">
                                                    {Object.values(
                                                        participant.score[eventMetadata.name][user.id]
                                                    ).reduce((a, b) => a + parseInt(b), 0)}
                                                </p>
                                            </div>
                                            <hr className="border-dashed" />
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold">Comments</label>
                                                <p className="text-md">
                                                    {participant.comment[eventMetadata.name][user.id] ??
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
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
    );
}