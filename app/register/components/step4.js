"use client";

import { useState } from "react";

export default function Step4({
	previousStep,
	nextStep,
	formData,
	setFormData,
}) {
	const [step4Error, setstep4Error] = useState({});

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
		if (!formData.dod) {
			errors.dod = "Date of departure is mandatory";
			alert("Date of departure is mandatory");
		}
		if (!formData.tod) {
			errors.tod = "Time of departure is mandatory";
			alert("Time of departure is mandatory");
		}
		if (!formData.drop) {
			errors.drop = "Drop facility is mandatory";
			alert("Drop facility is mandatory");
		}
		if (formData.drop === "Yes" && !formData.mot) {
			errors.mot = "Mode of Transport is mandatory";
			alert("Mode of Transport is mandatory");
		}
		if (formData.drop === "Yes" && !formData.dp) {
			errors.dp = "Drop off point is mandatory";
			alert("Drop off point is mandatory");
		}

		setstep4Error(errors);
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
						{/* Date of Departure */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Date of Departure
							</h2>
							<div className="flex flex-col gap-2">
								<input
									type="date"
									name="dod"
									value={formData.dod || ""}
									onChange={handleChange}
									required
									className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl"
								/>
								{step4Error.dod && (
									<span className="text-red-500 text-sm">{step4Error.dod}</span>
								)}
							</div>
						</div>

						{/* Time of Departure */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Time of Departure
							</h2>
							<div className="flex flex-col gap-2">
								<input
									type="time"
									name="tod"
									value={formData.tod || ""}
									onChange={handleChange}
									required
									className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl"
								/>
								{step4Error.tod && (
									<span className="text-red-500 text-sm">{step4Error.tod}</span>
								)}
							</div>
						</div>

						{/* Drop Facility */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Does the student need drop facility?
							</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="drop"
										value="Yes"
										checked={formData.drop === "Yes"}
										onChange={handleChange}
										required
										className="w-4 h-4 mt-2"
									/>
									<span className="text-xl text-gray-700 mt-2">Yes</span>
								</label>

								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="drop"
										value="No"
										checked={formData.drop === "No"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">No</span>
								</label>
							</div>
						</div>

						{/* Mode of Travel */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Mode of Travel</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="mot"
										value="Train"
										checked={formData.mot === "Train"}
										onChange={handleChange}
										className="w-4 h-4 mt-2"
									/>
									<span className="text-xl text-gray-700 mt-2">Train</span>
								</label>

								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="mot"
										value="Bus"
										checked={formData.mot === "Bus"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">Bus</span>
								</label>
								{step4Error.mot && (
									<span className="text-red-500 text-sm">{step4Error.mot}</span>
								)}
							</div>
						</div>

						{/* Drop Off Point */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Drop Off Point</h2>
							<div className="flex flex-col gap-2">
								<input
									type="text"
									name="dp"
									placeholder="Drop Off Point (Landmark)"
									value={formData.dp || ""}
									onChange={handleChange}
									className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
								/>
								{step4Error.dp && (
									<span className="text-red-500 text-sm">{step4Error.dp}</span>
								)}
							</div>
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
