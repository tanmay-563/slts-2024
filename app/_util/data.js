import {
	getDoc,
	doc,
	getDocs,
	query,
	collection,
	where,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/app/_util/initApp";

export const getUserData = async () => {
	if (!auth.currentUser) {
		return null;
	}

	const userDataDocRef = doc(db, "userData", auth.currentUser.uid);
	const docSnap = await getDoc(userDataDocRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

export const getRegistrationData = async () => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	const registrationDataCollectionRef = collection(db, "registrationData");
	const querySnapshot = await getDocs(registrationDataCollectionRef);
	const data = [];
	querySnapshot.forEach((doc) => {
		data.push(doc.data());
	});

	data.forEach((row) => {
		for (const key in row) {
			if (typeof row[key] === "number" && isNaN(row[key])) {
				row[key] = null;
			}
		}
	});

	data.sort((a, b) => {
		if (a.district < b.district) {
			return -1;
		}
		if (a.district > b.district) {
			return 1;
		}
		return 0;
	});

	// Collect unique district names, event names, group names.
	const districtSet = new Set();
	const eventNameSet = new Set();
	const groupNameSet = new Set();
	const modeOfTravelSet = new Set();
	const modeOfTravelForDropSet = new Set();
	const checkInDateSet = new Set();
	const checkOutDateSet = new Set();

	data.forEach((row) => {
		districtSet.add(row.district);
		row.registeredEvents.forEach((event) => {
			eventNameSet.add(event);
		});
		groupNameSet.add(row.studentGroup);

		if (row.modeOfTravel != "" && row.modeOfTravel != null) {
			modeOfTravelSet.add(row.modeOfTravel);
		}

		if (row.modeOfTravelForDrop != "" && row.modeOfTravelForDrop != null) {
			modeOfTravelForDropSet.add(row.modeOfTravelForDrop);
		}

		if (row.checkInDate != "" && row.checkInDate != null) {
			checkInDateSet.add(row.checkInDate);
		}

		if (row.checkOutDate != "" && row.checkOutDate != null) {
			checkOutDateSet.add(row.checkOutDate);
		}
	});

	return [
		data,
		Array.from(districtSet),
		Array.from(eventNameSet),
		Array.from(groupNameSet),
		Array.from(modeOfTravelSet),
		Array.from(modeOfTravelForDropSet),
		Array.from(checkInDateSet),
		Array.from(checkOutDateSet),
	];
};

export const getDistrcitData = async (district) => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	const registrationDataCollectionRef = query(
		collection(db, "registrationData"),
		where("district", "==", district)
	);
	const querySnapshot = await getDocs(registrationDataCollectionRef);
	const data = [];
	querySnapshot.forEach((doc) => {
		data.push(doc.data());
	});

	data.forEach((row) => {
		for (const key in row) {
			if (typeof row[key] === "number" && isNaN(row[key])) {
				row[key] = null;
			}
		}
	});

	data.sort((a, b) => {
		if (a.district < b.district) {
			return -1;
		}
		if (a.district > b.district) {
			return 1;
		}
		return 0;
	});

	// Collect unique event names, group names.
	const eventNameSet = new Set();
	const groupNameSet = new Set();

	data.forEach((row) => {
		row.registeredEvents.forEach((event) => {
			eventNameSet.add(event);
		});
		groupNameSet.add(row.studentGroup);
	});

	return [data, Array.from(eventNameSet), Array.from(groupNameSet)];
};

export const getEventData = async (eventName) => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	const eventDataCollectionRef = collection(db, "eventData");
	const querySnapshot = await getDocs(eventDataCollectionRef);
	const data = [];

	querySnapshot.forEach((doc) => {
		data.push(doc.data());
	});

	// Collect Unique Group Names
	const groupNameSet = new Set();
	data.forEach((row) => {
		row.group.forEach((group) => {
			groupNameSet.add(group);
		});
	});

	return [data, Array.from(groupNameSet)];
};

export const updateCrieria = async (eventName, criteria) => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	// typecast all values to float.
	Object.keys(criteria).forEach((key) => {
		criteria[key] = parseFloat(criteria[key]);
	});

	await updateDoc(doc(db, "eventData", eventName), {
		evalCriteria: criteria,
	});

	return true;
};

export const getJudgeGroupEventData = async (eventName) => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	const eventDoc = await getDoc(doc(db, "eventData", eventName));
	const eventMetaData = eventDoc.data();

	const participantRef = query(
		collection(db, "registrationData"),
		where("registeredEvents", "array-contains", eventMetaData.name)
	);
	const participantSnapshot = await getDocs(participantRef);

	const participants = [];
	participantSnapshot.forEach((doc) => {
		participants.push(doc.data());
	});

	participants.forEach((row) => {
		for (const key in row) {
			if (typeof row[key] === "number" && isNaN(row[key])) {
				row[key] = null;
			}
		}
	});

	const districtData = {};
	participants.forEach((row) => {
		if (!districtData[row.district]) {
			districtData[row.district] = [];
		}
		districtData[row.district].push(row);
	});

	return [districtData, eventMetaData];
};

export const getJudgeEventData = async (eventName) => {
	// if (!auth.currentUser) {
	//     return null;
	// }

	const eventDoc = await getDoc(doc(db, "eventData", eventName));
	const eventMetaData = eventDoc.data();

	const participantRef = query(
		collection(db, "registrationData"),
		where("registeredEvents", "array-contains", eventMetaData.name)
	);
	const participantSnapshot = await getDocs(participantRef);

	const participants = [];
	participantSnapshot.forEach((doc) => {
		participants.push(doc.data());
	});

	participants.forEach((row) => {
		for (const key in row) {
			if (typeof row[key] === "number" && isNaN(row[key])) {
				row[key] = null;
			}
		}
	});

	participants.sort((a, b) => {
		if (a.district < b.district) {
			return -1;
		}
		if (a.district > b.district) {
			return 1;
		}
		return 0;
	});

	return [participants, eventMetaData];
};

export const markScore = async (
	studentId,
	eventName,
	judgeId,
	score,
	comment
) => {
	// update score dict vals to float.
	Object.keys(score).forEach((key) => {
		score[key] = parseFloat(score[key]);
	});

	await updateDoc(doc(db, "registrationData", studentId), {
		[`score.${eventName}.${judgeId}`]: score,
		[`comment.${eventName}.${judgeId}`]: comment == "" ? "-" : comment ?? "-",
	});
	return true;
};

export const markGroupScore = async (
	studentIds,
	eventName,
	judgeId,
	score,
	comment
) => {
	Object.keys(score).forEach((key) => {
		if (typeof score[key] !== "number") {
			score[key] = parseFloat(score[key]);
		}
	});

	for (const studentId of studentIds) {
		await updateDoc(doc(db, "registrationData", studentId), {
			[`score.${eventName}.${judgeId}`]: score,
			[`comment.${eventName}.${judgeId}`]: comment == "" ? "-" : comment ?? "-",
		});

		// console.log(`Updated student: ${studentId}`);
	}

	return true;
};
