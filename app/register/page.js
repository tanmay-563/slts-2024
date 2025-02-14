"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Register()
{
    const [formData,setFormData] = useState({
        group:"",
        fullName:"",
        dob:"",
        gender:"",
        district:"",
        samithiName:"",
        yoj:"",
        doj:"",
    });

    const [errors,setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    //field validation
    const validateForms = () => {
        let newErrors = {};

        if (!formData.group)
            newErrors.group = "Group is mandatory";
        if (!formData.fullName)
            newErrors.fullName = "Name is mandatory";
        if (!formData.dob)
            newErrors.dob = "Date of Birth is mandatory";
        else
        {
            if (formData.group == "Group 1" && (formData.dob<"25-12-2015" || formData.dob>"24-12-2019"))
                newErrors.dob = "For Group 1, DOB should be between 25-12-2015 and 24-12-2019"
            else if (formData.group == "Group 2" && (formData.dob<"25-12-2012" || formData.dob>"24-12-2015"))
                newErrors.dob = "For Group 2, DOB should be between 25-12-2012 and 24-12-2015"
            else if (formData.group == "Group 3" && (formData.dob<"25-12-2008" || formData.dob>"24-12-2012"))
                newErrors.dob = "For Group 3, DOB should be between 25-12-2008 and 24-12-2012"
        }
        if (!formData.gender)
            newErrors.gender = "Gender is mandatory";
        if (!formData.district)
            newErrors.district = "District is mandatory";
        if (!formData.samithiName)
            newErrors.samithiName = "Samithi is mandatory";
        if (!formData.yoj)
            newErrors.yoj = "Year of Joining is mandatory";

        setErrors(newErrors);
        return Object.keys(newErrors).length===0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForms())
        {
            alert("Registered Successfully!")
        }
    };

    return(
        <>
            <div className="flex flex-col justify-center w-screen md:fit ml-auto mr-auto">
                <div className = "rounded-2xl p-4 mt-4 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto justify-center flex flex-col md:flex-row gap-4 md:gap-0">
                    <h1 className="text-3xl font-bold text-center text-black">SLTS Registration Form</h1>
                </div>

                <form>
                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Which GROUP does the student belong to?</h2>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="group" value="Group 1" onChange={handleChange} className="w-4 h-4 mt-2" />
                                <span className="text-xl text-gray-700 mt-2">Group 1</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="group" value="Group 2" onChange={handleChange} className="w-4 h-4" />
                                <span className="text-xl text-gray-700">Group 2</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="group" value="Group 3" onChange={handleChange} className="w-4 h-4" />
                                <span className="text-xl text-gray-700">Group 3</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="group" value="General Category" onChange={handleChange} className="w-4 h-4" />
                                <span className="text-xl text-gray-700">General Category</span>
                            </label>

                            {errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Student's Full Name</h2>
                        <div className="flex flex-col gap-2">
                            <input type="text" name="fullName" placeholder="Student's Full Name" value={formData.fullName.toUpperCase()} onChange={handleChange} required  className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto"></input>
                            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Student's Date of Birth (DOB)</h2>
                        <div className="flex flex-col gap-2">
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto"></input>
                            {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Student's Gender</h2>
                        <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="Male" onChange={handleChange} className="w-4 h-4 mt-2" />
                                <span className="text-xl text-gray-700 mt-2">Male</span>
                        </label>

                        <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="Female" onChange={handleChange} className="w-4 h-4 mt-2" />
                                <span className="text-xl text-gray-700 mt-2">Female</span>
                        </label>
                        {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4">
                        <h2 className="text-xl text-black text-left">Which district does the student belong to?</h2>
                        <div className="flex flex-col gap-2">
                            <select name="district" onChange={handleChange} value={formData.district} className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto">
                                <option value="" disabled>Select a district</option>
                                <option value="Chennai East Coast">Chennai East Coast</option>
                                <option value="Chennai North">Chennai North</option>
                                <option value="Chennai North West">Chennai North West</option>
                                <option value="Chennai South">Chennai South</option>
                                <option value="Chennai South East">Chennai South East</option>
                                <option value="Chennai West">Chennai West</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Cuddalore">Cuddalore</option>
                                <option value="Dharmapuri / Krishnagiri">Dharmapuri / Krishnagiri</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Erode">Erode</option>
                                <option value="Kanchipuram North">Kanchipuram North</option>
                                <option value="Kanchipuram South">Kanchipuram South</option>
                                <option value="Kanyakumari">Kanyakumari</option>
                                <option value="Karur">Karur</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Mayiladuthurai">Mayiladuthurai</option>
                                <option value="Nagapattinam">Nagapattinam</option>
                                <option value="Namakkal">Namakkal</option>
                                <option value="Nilgiris">Nilgiris</option>
                                <option value="Puducherry">Puducherry</option>
                                <option value="Salem">Salem</option>
                                <option value="Sivaganga & Ramnad">Sivaganga & Ramnad</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Theni">Theni</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Tirupur">Tirupur</option>
                                <option value="Tiruvallur East">Tiruvallur East</option>
                                <option value="Tiruvallur West">Tiruvallur West</option>
                                <option value="Tiruvannamalai">Tiruvannamalai</option>
                                <option value="Trichy">Trichy</option>
                                <option value="Tuticorin">Tuticorin</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Villupuram">Villupuram</option>
                                <option value="Virudhunagar">Virudhunagar</option>
                            </select>
                            {errors.district && <span className="text-red-500 text-sm">{errors.district}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Name of Samithi</h2>
                        <div className="flex flex-col gap-2">
                            <input type="text" name="samithiName" onChange={handleChange} placeholder="Name of Samithi" required className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto"></input>
                            {errors.samithiName && <span className="text-red-500 text-sm">{errors.samithiName}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Student's Year of Joining Balvikas</h2>
                        <div className="flex flex-col gap-2">
                            <input type="number" name="yoj" onChange={handleChange} placeholder="YOJ (2024,2023,etc,..)" required className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto"></input>
                            {errors.yoj && <span className="text-red-500 text-sm">{errors.yoj}</span>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 mt-10 w-11/12 sm:w-8/12 mx-auto bg-white shadow-lg border border-gray-300 overflow-x-auto flex flex-col gap-4 md:gap-0">
                        <h2 className="text-xl text-black text-left">Student's Date of Joining Balvikas (Optional)</h2>
                        <div className="flex flex-col gap-2">
                            <input type="date" name="doj" onChange={handleChange} className="text-xl text-gray-700 border border-gray-500 p-4 mt-2 rounded-2xl w-full sm:w-auto"></input>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button type="submit" onClick = {handleSubmit} className="text-2xl font-bold mt-12 mb-7">
                            <span className="bg-white p-4 rounded-2xl hover:bg-black hover:text-white hover:border-blue border border-black">Submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}