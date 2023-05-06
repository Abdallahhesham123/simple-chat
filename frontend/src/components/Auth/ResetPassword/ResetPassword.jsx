
import joi from "joi";
import React, {  useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../../Styles/Styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../../server";

const ResetPassword = () => {
  const {token}= useParams();
  const [user, setuser] = useState({
    code: "",
    password: "",
    confirm_pass:""
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
      code: joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
        confirm_pass:joi.string().required().valid(joi.ref("password")),
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
    let response = await fetch(`${server}/auth/reset-password-forgetted/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const DataReturned = await response.json();
    console.log(DataReturned);
    if (response.ok) {
      if (DataReturned.message) {
        toast.success(DataReturned.message);
        navigate("/", { replace: true }); 
      }
    } else {
      if (DataReturned.message) {
        toast.error(DataReturned.message);
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
        Welcome In Reset Password Page
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
             Code From Email
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="code"
                required
                value={user.code}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />

              {validateArrList?.includes("code") && (
                <>
                  <div
                    className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    <span className="font-medium">FrontEnd!</span> Please
                    Enter Avalid Code
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
              New-Password
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              confirm_password
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="confirm_pass"
                autoComplete="current-password"
                required
                value={user.confirm_pass}
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

            {validateArrList?.includes("confirm_pass") && (
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
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
          <div className={`${styles.noramlFlex} w-full`}>
            <h4>login page?</h4>
            <Link to="/login" className="text-blue-600 pl-2">
              login
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default ResetPassword