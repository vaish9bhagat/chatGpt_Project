import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();
  const loginHandler = async (data) => {
    const modData = {
      email: data.email,
      password: data.password,
    };
    const API_URL = "https://novachat-tclo.onrender.com/auth/login";
    try {
      const res = await axios.post(API_URL, modData, { withCredentials: true });
      if (res.status === 200 && res.data?.token) {
        localStorage.setItem("token", res.data?.token);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
    reset();
  };
  return (
    <div className="w-full h-screen bg-[#020018] flex justify-center items-center text-white">
      <div className="rounded py-4 px-8 bg-[#28263B] shadow-lg">
        <form
          onSubmit={handleSubmit(loginHandler)}
          className="flex items-center justify-center flex-col gap-4"
          action=" "
        >
          <h1 className="text-3xl capitalize font-bold text-[#BE86FF]">
            LOG IN
          </h1>

          <div className="flex flex-col justify-center items-center">
            <input
              {...register("email", { required: true })}
              className="outline-0  px-1  bg-transparent rounded-bl-md rounded-tr-md  border-[#570DAD] border-2"
              type="email"
              id=""
              placeholder="enter email"
            />
            {errors?.email && (
              <span className="text-[12.5px] text-[#BE86FF]">
                field is empty
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center items-center">
            <input
              {...register("password", { required: true })}
              className="outline-0  px-1  bg-transparent  rounded-bl-md rounded-tr-md border-[#570DAD] border-2"
              type="password"
              id=""
              placeholder="enter password"
            />
            {errors?.password && (
              <span className="text-[12.5px] text-[#BE86FF]">
                field is empty
              </span>
            )}
          </div>
          <button
            type="submit"
            className="py-1 px-2 bg-[#570DAD] text-white rounded font-semibold mt-2 "
          >
            Log in
          </button>
          <p>
            if you don't have an account{" "}
            <NavLink
              className="underline text-[#BE86FF] uppercase font-semibold"
              to="/"
            >
              Sign up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
