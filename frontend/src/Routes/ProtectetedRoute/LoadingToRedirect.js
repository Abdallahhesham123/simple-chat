import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && navigate("/");
    return () => clearInterval(interval);
  }, [count, navigate]);
  return (
    <div style={{display:"flex", justifyContent:"center",alignItems:"center",height:"100vh" }}>
      <h5 className="text-danger">Sorry You Cant Authorized , I redirect you in {count} seconds</h5>
    </div>
  );
};

export default LoadingToRedirect;
