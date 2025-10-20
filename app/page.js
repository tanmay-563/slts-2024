"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData } from "@/app/_util/data";
import { auth } from "@/app/_util/initApp";
import { reverseDistrictCode } from "@/app/_util/maps";
import secureStorage from "@/app/_util/secureLocalStorage";

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	// Auto login on client only
	useEffect(() => {
		if (typeof window === "undefined" || !secureStorage?.getItem) {
			setIsLoading(false);
			return;
		}

		const user = secureStorage.getItem("user");
		if (user) {
			try {
				const data = JSON.parse(user);
				const role = (data.role || "").toString().toUpperCase();

				if (role === "ADMIN") {
					router.push("/admin");
				} else if (role === "JUDGE") {
					data.event?.includes("GROUP")
						? router.push("/judge/group")
						: router.push("/judge/individual");
				} else if (Object.keys(reverseDistrictCode).includes(role)) {
					router.push("/district");
				}
			} catch (e) {
				console.error("Failed to parse user data", e);
			}
		}

		setIsLoading(false);
	}, [router]);

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!email || !password) return;

		const normalizedEmail = email.toLowerCase().trim();
		setEmail(normalizedEmail);

		try {
			await signInWithEmailAndPassword(auth, normalizedEmail, password);
			const data = await getUserData();
			const role = (data.role || "").toString().toUpperCase();

			if (!secureStorage?.setItem) return;

			secureStorage.setItem("user", JSON.stringify(data));

			if (role === "ADMIN") {
				router.push("/admin");
			} else if (role === "JUDGE") {
				data.event?.includes("GROUP")
					? router.push("/judge/group")
					: router.push("/judge/individual");
			} else if (Object.keys(reverseDistrictCode).includes(role)) {
				router.push("/district");
			}
		} catch (error) {
			if (error.code === "auth/invalid-credential") {
				alert("Invalid credentials. Please try again.");
			} else {
				alert(error.code ?? "An error occurred. Please try again.");
			}
		}
	};

	return (
		<main className="flex h-screen flex-col justify-center items-center m-4 bg-gray-100">
			<h1 className="absolute top-4 left-4 text-[24px] font-bold">
				SLBTS.2024
			</h1>

			{isLoading ? (
				<div className="flex h-screen items-center justify-center">
					<p className="text-xl font-semibold">Loading....</p>
				</div>
			) : (
				<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-200 rounded-3xl w-full md:w-[500px] bg-white shadow-lg">
					<h1 className="text-2xl font-semibold text-center pt-2">Sign In</h1>
					<p className="text-center text-gray-500 pb-2">
						SLBTS 2024, Tamil Nadu
					</p>
					<hr />
					<form className="flex flex-col gap-4 p-8" onSubmit={handleLogin}>
						<input
							type="email"
							placeholder="Email"
							className="border border-gray-200 p-2 rounded-lg"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								className="border border-gray-200 p-2 rounded-lg w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<span
								className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "🫣" : "👁"}
							</span>
						</div>
						<button
							type="submit"
							disabled={!email || !password}
							className="w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed mt-8"
						>
							Sign In
						</button>
					</form>
				</div>
			)}
		</main>
	);
}
