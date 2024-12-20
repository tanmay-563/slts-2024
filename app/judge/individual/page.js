"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { getJudgeEventData, markScore } from "@/app/_util/data";
import { auth } from "@/app/_util/initApp";

export default function JudgePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [eventMetadata, setEventMetadata] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [filteredParticipants, setFilteredParticipants] = useState(null);

  const [scoreBuffer, setScoreBuffer] = useState([]);
  const [commentBuffer, setCommentBuffer] = useState("");
  const [scoreMode, setScoreMode] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  const [isSaving, setIsSaving] = useState(false);

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
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-bold">{eventMetadata.name}</h1>
              <button
                className="bg-[#f7ffce] text-[#2c350b] font-bold px-4 py-1 rounded-xl"
                onClick={() => {
                  secureLocalStorage.setItem("event", JSON.stringify(eventMetadata));
                  router.push(
                    `/judge/${eventMetadata.name.includes("GROUP") ? "group/leaderboard" : "individual/leaderboard"
                    }`
                  );
                }}
              >
                View Leaderboard
              </button>
            </div>
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
                              )
                                .then((res) => {
                                  if (res) {
                                    let _scoreMode = {};
                                    participants.forEach((p) => {
                                      _scoreMode[p.studentId] = false;
                                    });
                                    setScoreMode(_scoreMode);

                                    let _participants = [...participants];
                                    const i = _participants.findIndex(
                                      (p) =>
                                        p.studentId == participant.studentId
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
                                      _participants[i].score[
                                        eventMetadata.name
                                      ][user.id][key] = val;
                                    });

                                    _participants[i].comment =
                                      _participants[i].comment ?? {};
                                    _participants[i].comment[
                                      eventMetadata.name
                                    ] =
                                      _participants[i].comment[
                                      eventMetadata.name
                                      ] ?? {};
                                    _participants[i].comment[
                                      eventMetadata.name
                                    ][user.id] = commentBuffer;

                                    setParticipants(_participants);
                                  }

                                  setIsSaving(false);
                                })
                                .catch((_) => {
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
