import joi from "joi";
import React, {  useState } from "react";

import styles from "../../../Styles/Styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../../server";

const SendingEmail = () => {
  const [user, setuser] = useState({
    email: "",
  });
  const [validateArrList, setvalidateArrList] = useState(null);

  let handleChange = (e) => {
    let newuser = { ...user };
    newuser[e.target.name] = e.target.value;
    // console.log(newuser);
    setuser(newuser);
  };

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
    let response = await fetch(`${server}/auth/forgetpassword`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const DataReturned = await response.json();
    console.log(DataReturned);
    if (response.ok) {
      if (DataReturned.message) {
        toast.success(DataReturned.message);
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
        Sending Mail to reset password
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
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
          <div className={`${styles.noramlFlex} w-full`}>
            <h4>login page</h4>
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

export default SendingEmail