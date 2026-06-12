import axios from "./axios";

export const registerRequest = (user) => axios.post(`/register`, user);

export const loginRequest = (user) => axios.post(`/login`, user);

export const verifyTokenRequest = () => axios.get("/verify");

export const logoutRequest = () => axios.post("/logout");

export const updateUsernameRequest = (username) =>
  axios.put("/profile/username", { username });

export const updateEmailRequest = (email) =>
  axios.put("/profile/email", { email });

export const updatePasswordRequest = (password) =>
  axios.put("/profile/password", password);

export const deleteAccountRequest = () => axios.delete("/profile/account");

export const updateAvatarRequest = (formData) =>
  axios.put("/profile/avatar", formData);
