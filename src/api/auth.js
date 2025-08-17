import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:3000/api", // backend URL
	withCredentials: true, // send cookies (token)
});

export const signUp = async () => {
    const res = await API.post("/auth/signup");
    return res.data;
};

export const signIn = async (privateKey) => {
	const res = await API.post("/auth/signin", { privateKey });
	return res.data;
};

export const signOut = async () => {
	const res = await API.post("/auth/signout");
	return res.data;
};