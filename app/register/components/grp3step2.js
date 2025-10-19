"use client";

import { useState } from "react";

export default function Grp3Step2({
	previousStep,
	nextStep,
	formData,
	setFormData,
}) {
	const [grp3Error, setGrp3Error] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePrevious = () => {
		previousStep();
	};

	const validateForms = () => {
		const errors = {};
		if (!formData.pass) {
			errors.pass = "Pass status is mandatory";
			alert("Pass status is mandatory");
		}
		if (!formData.event1) {
			errors.event1 = "Event 1 is mandatory";
			alert("Event 1 is mandatory");
		}
		if (formData.event1 === formData.event2) {
			errors.event2 = "Event 1 and Event 2 cannot be the same";
			alert("Event 1 and Event 2 cannot be the same");
		}
		if (
			(formData.event1 === "Drawing" && formData.quiz === "Yes") ||
			(formData.event2 === "Drawing" && formData.quiz === "Yes")
		) {
			errors.quiz =
				"Student cannot participate in both Quiz and Drawing at the same time";
			alert(
				"Student cannot participate in both Quiz and Drawing at the same time",
			);
		}
		if (
			(formData.event1?.startsWith("Tamizh Chants") &&
				formData.event2?.startsWith("Bhajans")) ||
			(formData.event1?.startsWith("Bhajans") &&
				formData.event2?.startsWith("Tamizh Chants"))
		) {
			errors.event2 =
				"Student cannot participate in Tamizh Chants and Bhajans at the same time";
			alert(
				"Student cannot participate in Tamizh Chants and Bhajans at the same time",
			);
		}
		if (formData.event1?.startsWith("GROUP") && formData.quiz === "Yes") {
			errors.quiz =
				"Student cannot participate in Quiz and Group Events at the same time";
			alert(
				"Student cannot participate in Quiz and Group Events at the same time",
			);
		}

		setGrp3Error(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForms()) {
			nextStep();
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center w-screen md:fit ml-auto mr-auto">
				<form onSubmit={handleSubmit}>
					<div className="rounded-2xl p-6 mt-8 mb-8 w-11/12 sm:w-8/12 mx-auto bg-gray-200 shadow-lg border border-gray-300 flex flex-col gap-4">
						{/* Pass Status */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-4">
							<h2 className="text-xl text-black text-left">
								Has the student passed Group 2 examination?
							</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="pass"
										value="Yes"
										checked={formData.pass === "Yes"}
										onChange={handleChange}
										required
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">Yes</span>
								</label>

								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="pass"
										value="No"
										checked={formData.pass === "No"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">No</span>
								</label>

								{grp3Error.pass && (
									<span className="text-red-500 text-sm">{grp3Error.pass}</span>
								)}
							</div>
						</div>

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
								<option value="Bhajans - Boys">Bhajans - Boys</option>
								<option value="Bhajans - Girls">Bhajans - Girls</option>
								<option value="Slokas - Boys">Slokas - Boys</option>
								<option value="Slokas - Girls">Slokas - Girls</option>
								<option value="Vedam Chanting - Boys">
									Vedam Chanting - Boys
								</option>
								<option value="Vedam Chanting - Girls">
									Vedam Chanting - Girls
								</option>
								<option value="Elocution - English">Elocution - English</option>
								<option value="Elocution - Tamizh">Elocution - Tamizh</option>
								<option value="Drawing">Drawing</option>
								<option value="Tamizh Chants - Boys">
									Tamizh Chants - Boys
								</option>
								<option value="Tamizh Chants - Girls">
									Tamizh Chants - Girls
								</option>
								<option value="GROUP - Altar Decoration (Boys)">
									GROUP - Altar Decoration (Boys)
								</option>
								<option value="GROUP - Altar Decoration (Girls)">
									GROUP - Altar Decoration (Girls)
								</option>
								<option value="GROUP - Devotional Singing (Boys)">
									GROUP - Devotional Singing (Boys)
								</option>
								<option value="GROUP - Devotional Singing (Girls)">
									GROUP - Devotional Singing (Girls)
								</option>
								<option value="GROUP - Rudram Namakam Chanting (Boys)">
									GROUP - Rudram Namakam Chanting (Boys)
								</option>
								<option value="GROUP - Rudram Namakam Chanting (Girls)">
									GROUP - Rudram Namakam Chanting (Girls)
								</option>
							</select>
							{grp3Error.event1 && (
								<span className="text-red-500 text-sm">{grp3Error.event1}</span>
							)}
						</div>

						{/* Event 2 */}
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
								<option value="Bhajans - Boys">Bhajans - Boys</option>
								<option value="Bhajans - Girls">Bhajans - Girls</option>
								<option value="Slokas - Boys">Slokas - Boys</option>
								<option value="Slokas - Girls">Slokas - Girls</option>
								<option value="Vedam Chanting - Boys">
									Vedam Chanting - Boys
								</option>
								<option value="Vedam Chanting - Girls">
									Vedam Chanting - Girls
								</option>
								<option value="Elocution - English">Elocution - English</option>
								<option value="Elocution - Tamizh">Elocution - Tamizh</option>
								<option value="Drawing">Drawing</option>
								<option value="Tamizh Chants - Boys">
									Tamizh Chants - Boys
								</option>
								<option value="Tamizh Chants - Girls">
									Tamizh Chants - Girls
								</option>
							</select>
							{grp3Error.event2 && (
								<span className="text-red-500 text-sm">{grp3Error.event2}</span>
							)}
						</div>

						{/* Quiz */}
						<div className="rounded-2xl p-6 mt-8 bg-gray-100 shadow-lg border border-gray-300 flex flex-col gap-4">
							<h2 className="text-xl text-black text-left">
								Would the student like to participate in Quiz?
							</h2>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="quiz"
										value="Yes"
										checked={formData.quiz === "Yes"}
										onChange={handleChange}
										required
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">Yes</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="quiz"
										value="No"
										checked={formData.quiz === "No"}
										onChange={handleChange}
										className="w-4 h-4"
									/>
									<span className="text-xl text-gray-700">No</span>
								</label>
							</div>
							{grp3Error.quiz && (
								<span className="text-red-500 text-sm">{grp3Error.quiz}</span>
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
