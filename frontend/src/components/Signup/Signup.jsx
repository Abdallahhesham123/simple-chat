import React, { useState } from "react";
import axios from "axios";
import joi from "joi";
import styles from "../../Styles/Styles";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import { server } from "../../server";
const Signup = () => {
  const [visible, setVisible] = useState(false);
  const [user, setuser] = useState({
    username: "",
    email: "",
    password: "",
    confirm_pass: "",
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
      username: joi.string().min(3).max(20).messages({
        "string.empty": "Please fill your username field",
      }),
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
      confirm_pass: joi
        .string()
        .required()
        .valid(joi.ref("password"))
        .messages({
          "any.only": "this field must be matched with password field",
        }),
    });
    return schema.validate(user, { abortEarly: false });
  };

  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file.size >= 1048576) {
      return toast.error("file size Is Not correct");
      // }
      // else if(file.type === 'image/png' || file.type !== 'image/jpeg' || file.type !== 'image/jpg'){
      //   return toast.error("Invalid file you must enter image only");
    } else {
      setAvatar(file);
    }
  };

  const handleSubmit = (e) => {
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
    } else if (!avatar) {
      return toast.error("File is require");
    } else {
      getDataOfAPi();
    }
  };

  const getDataOfAPi = () => {
    setvalidateArrList(null);
    const config = {
      headers: {
        // "Accept": "application/json",
        "Content-Type": `multipart/form-data`,
      },
    };
    const newForm = new FormData();

    newForm.append("image", avatar);
    newForm.append("username", user.username);
    newForm.append("email", user.email);
    newForm.append("password", user.password);
    newForm.append("confirm_pass", user.confirm_pass);
    axios
      .post(`${server}/auth/register`, newForm, config)
      .then((res) => {
        toast.success(res.data.message);
        setuser({
          username: "",
          email: "",
          password: "",
          confirm_pass: "",
        });
        setAvatar();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="min-h-screen  flex flex-col justify-center  sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
          Welcome In Chat-App
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  autoComplete="name"
                  required
                  value={user.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {validateArrList?.includes("username") && (
                  <>
                    <div
                      className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span className="font-medium">FrontEnd!</span> Please
                      Enter Avalid username between 3 and 20 char
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-700"
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
                className="block text-sm font-medium text-blue-700"
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
                    <span className="font-medium">FrontEnd!</span> Please Enter
                    Strong Password include Capital Letter and number at least
                    one character
                  </div>
                </>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-700"
              >
                Confirmation-Password
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
                    <span className="font-medium">FrontEnd!</span> Password Not
                    matched!
                  </div>
                </>
              )}
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-blue-700"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
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
              <h4>Already have an account?</h4>
              <Link to="/" className="text-blue-600 pl-2">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
