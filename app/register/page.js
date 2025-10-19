"use client";
import { useEffect, useState } from "react";
import secureStorage from "@/app/_util/secureLocalStorage";

import GeneralStep2 from "./components/generalcatstep2";
import Grp2Step2 from "./components/grp2step2";
import Grp3Step2 from "./components/grp3step2";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import Step5 from "./components/step5";
import Step6 from "./components/step6";

const RegisterPage = () => {
	const [step, setStep] = useState(1);
	const [completedSteps, setCompletedSteps] = useState([1]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [guru, setGuru] = useState("");
	const [formData, setFormData] = useState({});

	// Load saved form data on mount
	useEffect(() => {
		const savedData = secureStorage?.getItem("registrationData");
		if (savedData) {
			try {
				setFormData(JSON.parse(savedData));
			} catch (e) {
				console.error("Error loading saved form data", e);
			}
		}
	}, []);

	// Save form data on every change
	useEffect(() => {
		if (Object.keys(formData).length > 0) {
			secureStorage?.setItem("registrationData", JSON.stringify(formData));
		}
	}, [formData]);

	const nextStep = () => {
		if (!completedSteps.includes(step + 1)) {
			setCompletedSteps([...completedSteps, step + 1]);
		}
		setStep(step + 1);
	};

	const previousStep = () => {
		setStep(step - 1);
	};

	const steps = [
		{ id: 1, name: "Section 1" },
		{ id: 2, name: "Section 2" },
		{ id: 3, name: "Section 3" },
		{ id: 4, name: "Section 4" },
		{ id: 5, name: "Section 5" },
		{ id: 6, name: "Section 6" },
	];

	return (
		<>
			<div className="bg-gray-200 rounded-2xl p-4 mt-4 w-11/12 sm:w-8/12 mx-auto shadow-lg border border-gray-300 overflow-x-auto justify-center flex flex-col md:flex-row gap-4 md:gap-0">
				<h1 className="text-2xl sm:text-3xl font-bold text-center text-black">
					SLTS Registration Form
				</h1>
			</div>

			<div className="w-11/12 sm:w-8/12 mx-auto p-5">
				<div className="flex overflow-x-auto whitespace-nowrap justify-between border-b border-gray-300 pb-3">
					{steps.map((s) => (
						<button
							key={s.id}
							onClick={() => setStep(s.id)}
							disabled={!completedSteps.includes(s.id)}
							className={`${
								step === s.id
									? "rounded-2xl text-xl px-4 py-2 font-bold transition-all bg-gray-500 text-white font-bold"
									: "text-xl px-4 py-2 transition-all text-black"
							}${!completedSteps.includes(s.id) ? "opacity-50 cursor-not-allowed text-gray-500" : ""}`}
						>
							{s.name}
						</button>
					))}
				</div>
			</div>

			<div>
				{step === 1 && (
					<Step1
						nextStep={nextStep}
						setSelectedGroup={setSelectedGroup}
						setGuru={setGuru}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 2 && selectedGroup === "Group 1" && (
					<Step2
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 2 && selectedGroup === "Group 2" && (
					<Grp2Step2
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 2 && selectedGroup === "Group 3" && (
					<Grp3Step2
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 2 && selectedGroup === "General Category" && (
					<GeneralStep2
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 3 && (
					<Step3
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 4 && (
					<Step4
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 5 && (
					<Step5
						nextStep={nextStep}
						previousStep={previousStep}
						guru={guru}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
				{step === 6 && (
					<Step6
						nextStep={nextStep}
						previousStep={previousStep}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
			</div>
		</>
	);
};

export default RegisterPage;
