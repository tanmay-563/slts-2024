"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../_util/initApp";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) {
            router.push('/');
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.role !== 'admin') {
                router.push('/');
            } else {
                setUser(user);
            }
        }
    }, [router]);

    return user ? (
            <div>
                <h1>Welcome, {user.name}</h1>
                <p>{user.email}.</p>
            </div>
        ) : (
            <div className="flex h-screen items-center justify-center">Loading...</div>
        )
    
}