"use client";

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function EventLeaderboardGroupPage() {
    const router = useRouter();
    const [eventName, setEventName] = useState(null);

    useEffect(() => {
        if (!secureLocalStorage.getItem('event')) {
            router.push('/admin/event');
        }

        const event = JSON.parse(secureLocalStorage.getItem('event'));
        setEventName(event.name);
    }, [router])

    return eventName ? (
        <div>
            <h1>Event Leaderboard</h1>
            <p>Event ID: {eventName}</p>
            {/* TODO: Leaderboard for GROUP events. */}
        </div>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl font-semibold">Loading...</p>
        </div>
    )
}