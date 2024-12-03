"use client";

import { useParams } from "next/navigation"

export default function EventLeaderboardGroupPage() {
    const { eventId } = useParams();

    return eventId ? (
        <div>
            <h1>Event Leaderboard</h1>
            <p>Event ID: {decodeURI(eventId)}</p>
            {/* TODO: Leaderboard for GROUP events. */}
        </div>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl font-semibold">Loading...</p>
        </div>
    )
}