"use client";

import { useState } from "react";

export default function Step5({
	previousStep,
	nextStep,
	formData,
	setFormData,
}) {
	const [step5Error, setstep5Error] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePrevious21 = () => {
		previousStep();
	};

	const validateForm = () => {
		const errors = {};

		if (!formData.guruName) {
			errors.guruName = "Guru name is mandatory";
			alert("Guru name is mandatory");
		}

		if (!formData.guruGender) {
			errors.guruGender = "Guru gender is mandatory";
			alert("Guru gender is mandatory");
		}

		if (!formData.guruMobile) {
			errors.guruMobile = "Guru mobile number is mandatory";
			alert("Guru mobile number is mandatory");
		} else if (!/^[0-9]{10}$/.test(formData.guruMobile)) {
			errors.guruMobile = "Enter a valid 10-digit mobile number";
			alert("Enter a valid 10-digit mobile number");
		}

		if (!formData.guruMail) {
			errors.guruMail = "Guru email ID is mandatory";
			alert("Guru email ID is mandatory");
		} else if (!/\S+@\S+\.\S+/.test(formData.guruMail)) {
			errors.guruMail = "Enter a valid email address";
			alert("Enter a valid email address");
		}

		if (!formData.numPersons) {
			errors.numPersons = "Please specify the number of accompanying persons";
			alert("Please specify the number of accompanying persons");
		}

		setstep5Error(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			nextStep();
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center w-screen md:fit ml-auto mr-auto">
				<form onSubmit={handleSubmit}>
					<div className="rounded-2xl p-6 mt-8 mb-8 w-11/12 sm:w-8/12 mx-auto bg-gray-200 shadow-lg border border-gray-300 flex flex-col gap-4">
						{/* Guru Name */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Guru&apos;s Name</h2>
							<input
								type="text"
								name="guruName"
								value={formData.guruName || ""}
								onChange={handleChange}
								required
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							/>
							{step5Error.guruName && (
								<span className="text-red-500 text-sm">
									{step5Error.guruName}
								</span>
							)}
						</div>

						{/* Guru Gender */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Guru&apos;s Gender
							</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="guruGender"
										value="Male"
										checked={formData.guruGender === "Male"}
										onChange={handleChange}
										required
										className="w-4 h-4 mt-2"
									/>
									<span className="text-xl text-gray-700 mt-2">Male</span>
								</label>

								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="guruGender"
										value="Female"
										checked={formData.guruGender === "Female"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">Female</span>
								</label>

								{step5Error.guruGender && (
									<span className="text-red-500 text-sm">
										{step5Error.guruGender}
									</span>
								)}
							</div>
						</div>

						{/* Guru Mobile */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Guru&apos;s Mobile Number
							</h2>
							<input
								type="text"
								name="guruMobile"
								value={formData.guruMobile || ""}
								onChange={handleChange}
								required
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							/>
							{step5Error.guruMobile && (
								<span className="text-red-500 text-sm">
									{step5Error.guruMobile}
								</span>
							)}
						</div>

						{/* Guru Email */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Guru&apos;s Email ID
							</h2>
							<input
								type="email"
								name="guruMail"
								value={formData.guruMail || ""}
								onChange={handleChange}
								required
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							/>
							{step5Error.guruMail && (
								<span className="text-red-500 text-sm">
									{step5Error.guruMail}
								</span>
							)}
						</div>

						{/* Number of Accompanying Persons */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Number of Accompanying Persons
							</h2>
							<input
								type="number"
								name="numPersons"
								min="0"
								value={formData.numPersons || ""}
								onChange={handleChange}
								required
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							/>
							{step5Error.numPersons && (
								<span className="text-red-500 text-sm">
									{step5Error.numPersons}
								</span>
							)}
						</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between items-center w-full px-6 sm:px-20">
							<button
								onClick={handlePrevious21}
								type="button"
								className="text-2xl font-bold mt-6 sm:mt-12 mb-4 sm:mb-7"
							>
								<span className="bg-white p-4 rounded-2xl hover:bg-slate-900 hover:text-white border border-black transition">
									Previous
								</span>
							</button>

							<button
								type="submit"
								className="text-2xl font-bold mt-6 sm:mt-12 mb-4 sm:mb-7"
							>
								<span className="bg-white p-4 rounded-2xl hover:bg-slate-900 hover:text-white border border-black transition">
									Next
								</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
