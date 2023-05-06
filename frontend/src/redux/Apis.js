import axios from "axios";

const devEnv = process.env.NODE_ENV !== "production";

const { REACT_APP_DEV_API, REACT_APP_PROD_API } = process.env;

const API = axios.create({
  baseURL: `${devEnv ? REACT_APP_DEV_API : REACT_APP_PROD_API}`,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("token"))
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("/auth/login", formData);

export const googleSignIn = (result) => API.post("/auth/googleSignIn", {
  googleAccessToken:result
});
export const facebookSignIn = (result) => API.post("/auth/facebookSignIn", result);

export const GithubSignIn = (result) => API.post("/auth/GithubSignIn", result);

export const getAlluser = () => API.get("/user");

