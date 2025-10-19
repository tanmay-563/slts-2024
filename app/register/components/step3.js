"use client";

import { useState } from "react";

export default function Step3({
	previousStep,
	nextStep,
	formData,
	setFormData,
}) {
	const [step3Error, setstep3Error] = useState({});

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
		if (!formData.doa) {
			errors.doa = "Date of arrival is mandatory";
			alert("Date of arrival is mandatory");
		}
		if (!formData.toa) {
			errors.toa = "Time of arrival is mandatory";
			alert("Time of arrival is mandatory");
		}
		if (!formData.pickup) {
			errors.pickup = "Pickup facility is mandatory";
			alert("Pickup facility is mandatory");
		}
		if (formData.pickup === "Yes" && !formData.mot) {
			errors.mot = "Mode of Transport is mandatory";
			alert("Mode of Transport is mandatory");
		}
		if (formData.pickup === "Yes" && !formData.pp) {
			errors.pp = "Pickup point is mandatory";
			alert("Pickup point is mandatory");
		}

		setstep3Error(errors);
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
					<div className="rounded-2xl p-6 mt-8 mb-8 w-11/12 sm:w-8/12 mx-auto bg-gray-200 shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
						{/* Date of Arrival */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Date of Arrival</h2>
							<div className="flex flex-col gap-2">
								<input
									type="date"
									name="doa"
									value={formData.doa || ""}
									onChange={handleChange}
									required
									className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl"
								/>
								{step3Error.doa && (
									<span className="text-red-500 text-sm">{step3Error.doa}</span>
								)}
							</div>
						</div>

						{/* Time of Arrival */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Time of Arrival</h2>
							<div className="flex flex-col gap-2">
								<input
									type="time"
									name="toa"
									value={formData.toa || ""}
									onChange={handleChange}
									required
									className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl"
								/>
								{step3Error.toa && (
									<span className="text-red-500 text-sm">{step3Error.toa}</span>
								)}
							</div>
						</div>

						{/* Pickup Facility */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Does the student need pickup facility?
							</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="pickup"
										value="Yes"
										checked={formData.pickup === "Yes"}
										onChange={handleChange}
										required
										className="w-4 h-4 mt-2"
									/>
									<span className="text-xl text-gray-700 mt-2">Yes</span>
								</label>

								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="pickup"
										value="No"
										checked={formData.pickup === "No"}
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
								{step3Error.mot && (
									<span className="text-red-500 text-sm">{step3Error.mot}</span>
								)}
							</div>
						</div>

						{/* Pickup Point */}
						<div className="rounded-2xl p-6 mt-8 w-full sm:w-10/12 mx-auto bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">Pickup Point</h2>
							<div className="flex flex-col gap-2">
								<input
									type="text"
									name="pp"
									placeholder="Pickup Point (Landmark)"
									value={formData.pp || ""}
									onChange={handleChange}
									className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
								/>
								{step3Error.pp && (
									<span className="text-red-500 text-sm">{step3Error.pp}</span>
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
								<span className="bg-white p-4 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-blue border border-black transition">
									Previous
								</span>
							</button>

							<button
								type="submit"
								className="text-2xl font-bold mt-6 sm:mt-12 mb-4 sm:mb-7"
							>
								<span className="bg-white p-4 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-blue border border-black transition">
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
