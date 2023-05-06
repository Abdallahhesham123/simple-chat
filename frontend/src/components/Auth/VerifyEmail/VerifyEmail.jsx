import React, { useState } from 'react'
import { Navigate, useNavigate, useParams } from "react-router-dom";
import joi from "joi";
import { toast } from "react-toastify";
import { server } from "../../../server";
import "./Verify.css"
const VerifyEmail = () => {
  const {email} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({

    f1: 0,
    f2: 0,
    f3: 0,
    f4: 0,
  });
  const [validateArrList, setvalidateArrList] = useState(null);

  const handleInputChange = (e) => {
    const regex = /^[0-9]{1}$/;
// console.log(!regex.test(e.target.values));
    if(regex.test(e.target.value)){
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });

    }


  };

  let validationFormData = () => {
    const schema = joi.object({
      f1: joi
        .string()
        .pattern(
          new RegExp(/^\d{1}$/)
        )
        .required(),
      f2: joi
        .string()
        .pattern(
          new RegExp(/^\d{1}$/)
        )
        .required(),
        f3: joi
        .string()
        .pattern(
          new RegExp(/^\d{1}$/)
        )
        .required(),
      f4: joi
        .string()
        .pattern(
          new RegExp(/^\d{1}$/)
        )
        .required(),
    });
    return schema.validate(values, { abortEarly: false });
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
      let payload = `${values.f1}${values.f2}${values.f3}${values.f4}` 
      getDataOfAPi(payload);
    }
  };

  const getDataOfAPi = async(payload) => {
    setvalidateArrList(null);
    let response = await fetch(`${server}/auth/verify-email/${payload}/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const DataReturned = await response.json();
    console.log(DataReturned);
    if (response.ok) {
      if (DataReturned.message) {
        // localStorage.setItem("token", DataReturned.token);
        toast.success(DataReturned.message);
        navigate("/");
      
      }
    } else {
      if (DataReturned.message) {
        toast.error(DataReturned.message);
      }
    }
  };

 
  return (
    <div className="wrapper">
    <div className='container'>
          <h2>Verify Your Account</h2>
            <p>
              We emailed you the four digit code to personal@email.com <br/>
              Enter the code below to confirm your email address
            </p>
            <form  onSubmit={handleSubmit} >
        <div className="code-container">
            <input 
            type="text" 
            className="code" 
            placeholder="0"
             min="0" max="9" 
             required
             onChange={handleInputChange}
             maxLength={1}
             name="f1"
             />

<input 
              type="text" 
            className="code" 
            placeholder="0"
             min="0" max="9" 
             required
             onChange={handleInputChange}
             maxLength={1}
             name="f2"
             />
                         <input 
            type="text" 
            className="code" 
            placeholder="0"
            //  min="0" max="9" 
             required
             onChange={handleInputChange}
             maxLength={1}
             name="f3"
             />
                         <input 
             type="text" 
            className="code" 
            placeholder="0"
             min="0" max="9" 
             required
             onChange={handleInputChange}
             maxLength={1}
             name="f4"
             />
        </div>
          <div>
              <button type="submit" className="btn btn-primary">Verify</button>
          </div>
          </form>
          <small className="info">
               If you didn't receive a code !! <strong> RESEND</strong>
          </small>
          <ul >
  <li>{validateArrList?.includes("f1")? 
               <div
               className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
               role="alert"
             >
               <span className="font-medium">FrontEnd!</span> This field f1  must be number
             </div>
  
  
  :"" }</li>
   <li>{validateArrList?.includes("f2")? 
               <div
               className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
               role="alert"
             >
               <span className="font-medium">FrontEnd!</span> This field f2  must be number
             </div>
  
  
  :"" }
  </li> 
   <li>{validateArrList?.includes("f3")? 
  <div
  className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
  role="alert"
>
  <span className="font-medium">FrontEnd!</span> This field f3  must be number
</div>


:"" }</li> 
 <li>{validateArrList?.includes("f4")? 
<div
className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
role="alert"
>
<span className="font-medium">FrontEnd!</span> This field f4 must be number
</div>


:"" }</li>

</ul>
      
    </div>
    </div>

  )
}

export default VerifyEmail