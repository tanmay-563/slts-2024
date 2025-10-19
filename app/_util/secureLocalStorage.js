import CryptoJS from "crypto-js";
import SecureStorage from "secure-web-storage";

let secureStorage;

if (typeof window !== "undefined") {
	secureStorage = new SecureStorage(window.localStorage, {
		hash: function (key) {
			return CryptoJS.SHA256(key).toString();
		},
		encrypt: function (data) {
			return CryptoJS.AES.encrypt(data, "your-secret-key").toString();
		},
		//IMPORTANT NOTE:
		//I would recommend changing 'your-secret-key' to a more secure key and managing it properly by saving it to .env fileand using it here after that
		decrypt: function (data) {
			const bytes = CryptoJS.AES.decrypt(data, "your-secret-key");
			//I would recommend changing 'your-secret-key' to a more secure key and managing it properly by saving it to .env fileand using it here after that

			return bytes.toString(CryptoJS.enc.Utf8);
		},
	});
}

export default secureStorage;
