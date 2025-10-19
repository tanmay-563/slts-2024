"use client";

import { useState } from "react";

export default function Step6({ previousStep, formData, setFormData }) {
	const [step6Error, setStep6Error] = useState({});

	const handlePrevious = () => {
		previousStep();
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const validateForm = () => {
		const errors = {};

		if (!formData.declaration) {
			errors.declaration =
				"You must agree to the declaration before submitting.";
			alert("You must agree to the declaration before submitting.");
		}

		setStep6Error(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			alert("Form submitted successfully!");
			console.log("✅ Final Submitted Data:", formData);
			// You can integrate API submission logic here
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center w-screen md:fit ml-auto mr-auto">
				<form onSubmit={handleSubmit}>
					<div className="rounded-2xl p-6 mt-8 mb-8 w-11/12 sm:w-8/12 mx-auto bg-gray-200 shadow-lg border border-gray-300 flex flex-col gap-6">
						{/* Confirmation Header */}
						<h2 className="text-2xl font-bold text-center text-gray-900 mt-4">
							Step 6: Review & Confirm
						</h2>

						{/* Review Section */}
						<div className="rounded-2xl bg-gray-100 p-6 border border-gray-300 shadow-inner">
							<h3 className="text-xl font-semibold mb-3">
								Please review your details:
							</h3>
							<div className="text-lg text-gray-800 space-y-1">
								<p>
									<strong>Name:</strong> {formData.fullName}
								</p>
								<p>
									<strong>Group:</strong> {formData.group}
								</p>
								<p>
									<strong>Date of Birth:</strong> {formData.dob}
								</p>
								<p>
									<strong>Gender:</strong> {formData.gender}
								</p>
								<p>
									<strong>District:</strong> {formData.district}
								</p>
								<p>
									<strong>Samithi Name:</strong> {formData.samithiName}
								</p>
								<p>
									<strong>Year of Joining:</strong> {formData.yoj}
								</p>
								<p>
									<strong>Guru Accompanying:</strong> {formData.guru}
								</p>

								<p className="mt-4">
									<strong>Event 1:</strong> {formData.event1}
								</p>
								<p>
									<strong>Event 2:</strong> {formData.event2}
								</p>
								<p>
									<strong>Group Event:</strong> {formData.grpsinging}
								</p>

								<p className="mt-4">
									<strong>Date of Arrival:</strong> {formData.doa}
								</p>
								<p>
									<strong>Time of Arrival:</strong> {formData.toa}
								</p>
								<p>
									<strong>Pickup Facility:</strong> {formData.pickup}
								</p>
								<p>
									<strong>Mode of Travel:</strong> {formData.mot}
								</p>
								<p>
									<strong>Pickup Point:</strong> {formData.pp}
								</p>

								<p className="mt-4">
									<strong>Date of Departure:</strong> {formData.dod}
								</p>
								<p>
									<strong>Time of Departure:</strong> {formData.tod}
								</p>
								<p>
									<strong>Drop Facility:</strong> {formData.drop}
								</p>
								<p>
									<strong>Drop Point:</strong> {formData.dp}
								</p>

								<p className="mt-4">
									<strong>Guru Name:</strong> {formData.guruName}
								</p>
								<p>
									<strong>Guru Gender:</strong> {formData.guruGender}
								</p>
								<p>
									<strong>Guru Mobile:</strong> {formData.guruMobile}
								</p>
								<p>
									<strong>Guru Email:</strong> {formData.guruMail}
								</p>
								<p>
									<strong>Number of Accompanying Persons:</strong>{" "}
									{formData.numPersons}
								</p>
							</div>
						</div>

						{/* Declaration */}
						<div className="rounded-2xl bg-gray-100 p-6 border border-gray-300 shadow-inner flex flex-col gap-3">
							<label className="flex items-start gap-3">
								<input
									type="checkbox"
									name="declaration"
									checked={!!formData.declaration}
									onChange={handleChange}
									className="w-5 h-5 mt-1"
								/>
								<span className="text-gray-800 text-lg">
									I hereby declare that all the information provided above is
									true to the best of my knowledge. I agree to abide by the
									rules and regulations of the event.
								</span>
							</label>
							{step6Error.declaration && (
								<span className="text-red-500 text-sm">
									{step6Error.declaration}
								</span>
							)}
						</div>

						{/* Buttons */}
						<div className="flex justify-between items-center w-full px-6 sm:px-20 mt-6">
							<button
								onClick={handlePrevious}
								type="button"
								className="text-2xl font-bold mb-4"
							>
								<span className="bg-white p-4 rounded-2xl hover:bg-slate-900 hover:text-white border border-black transition">
									Previous
								</span>
							</button>

							<button type="submit" className="text-2xl font-bold mb-4">
								<span className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 border border-green-700 transition">
									Submit
								</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
