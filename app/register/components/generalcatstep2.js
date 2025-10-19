"use client";

import { useState } from "react";

export default function GeneralCatStep2({
	previousStep,
	nextStep,
	formData,
	setFormData,
}) {
	const [error, setError] = useState({});

	const handlePrevious = () => {
		previousStep();
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.event1) {
			errors.event1 = "Event 1 is mandatory";
			alert("Event 1 is mandatory");
		}
		if (formData.event1 === formData.event2) {
			errors.event2 = "Event 1 and Event 2 cannot be the same";
			alert("Event 1 and Event 2 cannot be the same");
		}
		setError(errors);
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
						{/* Event 1 */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Pick to register for 1st event
							</h2>
							<select
								name="event1"
								value={formData.event1 || ""}
								onChange={handleChange}
								required
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							>
								<option value="" disabled>
									Select an event
								</option>
								<option value="Essay Writing - English">
									Essay Writing - English
								</option>
								<option value="Essay Writing - Tamil">
									Essay Writing - Tamil
								</option>
								<option value="Elocution - English">Elocution - English</option>
								<option value="Elocution - Tamil">Elocution - Tamil</option>
								<option value="Quiz">Quiz</option>
							</select>
							{error.event1 && (
								<span className="text-red-500 text-sm">{error.event1}</span>
							)}
						</div>

						{/* Event 2 (Optional) */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-5">
							<h2 className="text-xl text-black text-left">
								Pick to register for 2nd event (optional)
							</h2>
							<select
								name="event2"
								value={formData.event2 || ""}
								onChange={handleChange}
								className="text-xl text-gray-700 border border-gray-500 p-4 rounded-2xl"
							>
								<option value="" disabled>
									Select an event
								</option>
								<option value="Essay Writing - English">
									Essay Writing - English
								</option>
								<option value="Essay Writing - Tamil">
									Essay Writing - Tamil
								</option>
								<option value="Elocution - English">Elocution - English</option>
								<option value="Elocution - Tamil">Elocution - Tamil</option>
								<option value="Quiz">Quiz</option>
							</select>
							{error.event2 && (
								<span className="text-red-500 text-sm">{error.event2}</span>
							)}
						</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between items-center w-full px-6 sm:px-20">
							<button
								onClick={handlePrevious}
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
