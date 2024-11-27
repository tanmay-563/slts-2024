"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./_util/initApp";
import { getUserData } from "./_util/data";
import { useRouter } from "next/navigation";
import { reverseDistrictCode } from "./_util/maps";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Auto login.
  // useEffect(() => {
  //   console.log(auth.currentUser);
  //   if (auth.currentUser) {
  //     getUserData().then((data) => {

  //     });
  //   }
  // }, []);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    setEmail(email.toString().toLowerCase().trim());
    signInWithEmailAndPassword(auth, email, password).then((_) => {
      getUserData().then((data) => {
        if (data.role == 'admin') {
          localStorage.setItem('user', JSON.stringify(data));
          router.push('/admin');
        } else if (Object.keys(reverseDistrictCode).indexOf(data.role.toString().toUpperCase()) != -1) {
          localStorage.setItem('user', JSON.stringify(data));
          router.push('/district');
        }
      });
    })
  }

  return (
    <main className="flex h-screen flex-col justify-center items-center">
      <div className="flex flex-col border border-gray-200 rounded-lg w-full md:w-[480px] bg-white">
        <h1 className="text-2xl font-semibold text-center pt-2">Sign In</h1>
        <p className="text-center text-gray-500 pb-2">SLBTS 2024, Tamil Nadu</p>
        <hr />
        <form className="flex flex-col gap-4 p-8" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-200 p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-200 p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={!email || !password}
            className="w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
