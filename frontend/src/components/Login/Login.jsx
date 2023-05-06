
import joi from "joi";
import React, {  useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../Styles/Styles";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {  login } from "../../redux/AuthSlice/user.js";
import { FacebookLoginButton } from "react-social-login-buttons"
import { LoginSocialFacebook} from "reactjs-social-login"
import GitHubLogin from 'react-github-login';
import { googleSignIn, facebookSignIn ,GithubSignIn } from "./../../redux/AuthSlice/user.js";
import { GoogleLogin } from "@react-oauth/google";
const Login = () => {
  const { loading, error } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [validateArrList, setvalidateArrList] = useState(null);

  let handleChange = (e) => {
    let newuser = { ...user };
    newuser[e.target.name] = e.target.value;
    // console.log(newuser);
    setuser(newuser);
  };
  const [visible, setVisible] = useState(false);

  let validationFormData = () => {
    const schema = joi.object({
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 3,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    });
    return schema.validate(user, { abortEarly: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ValidationErr = [];
    let Validationresponse = validationFormData();
    // console.log(Validationresponse);
    if (Validationresponse.error) {
      for (const detail of Validationresponse.error.details) {
        ValidationErr.push(detail.path[0]);
      }
      console.log(ValidationErr);
      setvalidateArrList(ValidationErr);
    } else {
      getDataOfAPi();
    }
  };

  const getDataOfAPi = async() => {
    setvalidateArrList(null);
      dispatch(login({ user, navigate, toast }));
  
    
  };
  useEffect(() => {
    error && toast.error(error);
 }, [error]);
 const onSuccess = (res) => {
  console.log(res)
  dispatch(GithubSignIn({ res, navigate, toast }));
}
const onFailure = response => console.error(response);
  return (
    <div className="min-h-screen flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-3 text-center text-3xl font-extrabold text-blue-900">
          Welcome Back In Login Page
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={user.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />

                {validateArrList?.includes("email") && (
                  <>
                    <div
                      className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span className="font-medium">FrontEnd!</span> Please
                      Enter Avalid Email
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={user.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>

              {validateArrList?.includes("password") && (
                <>
                  <div
                    className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    <span className="font-medium">Frontend!</span> Please
                    Enter Strong Password include Capital Letter and number at
                    least one character
                  </div>
                </>
              )}
            </div>
            <div className={`${styles.noramlFlex} justify-between`}>
              <div className={`${styles.noramlFlex}`}>
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forget-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                { loading ? "Loadding ...!":"Submit"}
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Not have any account?</h4>
              <Link to="/sign-up" className="text-blue-600 pl-2">
                Sign Up
              </Link>
            </div>
            <div className="block text-sm font-medium text-gray-700 mr-6">
              <h4 className="block text-xl font-medium text-red-700 mb-6">SocialLogin?</h4>


              
              <GoogleLogin
  onSuccess={credentialResponse => {
    // console.log(credentialResponse.credential);

    dispatch(googleSignIn({ googleAccessToken:credentialResponse.credential, navigate, toast }));

  }}
  onError={() => {
    console.log('Login Failed');
  }}

/>




<LoginSocialFacebook
appId="762510428991622"
onResolve={(res)=>{
  console.log(res)
  dispatch(facebookSignIn({res:res.data, navigate, toast }));
}}
onReject={(error)=>{
console.log(error);
}}
>
  <FacebookLoginButton />
</LoginSocialFacebook>

<GitHubLogin 
clientId="b395b0b9f0e6e3f60a55"
redirectUri="http://localhost:3000/chat" 
    onSuccess={onSuccess}
    onFailure={onFailure}
    className ="GitHub_Icon"
    >

<i class="fa-brands fa-github"></i> Github Login
    </GitHubLogin>
     
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
