import firebase from 'firebase';
const config = {
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: ".appspot.com",
	messagingSenderId: "",
	appId: "",
	measurementId: "G-",
	persistence: true
};

export const firebaseApp = firebase.initializeApp(config);