import React from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const signHandler = async (data) => {
    const modData = {
      email: data.email,
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      password: data.password,
    };
    const API_URL = "https://novachat-tclo.onrender.com/auth/register";
    try {
      const API = await axios
        .post(API_URL, modData, { withCredentials: true })
        .then((res) => {
          if (res.status === "200" && res.data?.token) {
            localStorage.setItem("token", res.data?.token);
            navigate("/home");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
    reset();
  };
  return (
    <div className="w-full h-screen bg-[#020018] flex justify-center items-center text-white">
      <div className="rounded py-4 px-8 bg-[#28263B] shadow-lg">
        <form
          onSubmit={handleSubmit(signHandler)}
          className="flex items-center justify-center flex-col gap-4"
          action=" "
        >
          <h1 className="text-2xl font-bold text-[#BE86FF]">Sign Up</h1>

          <div className="flex flex-col justify-center items-center">
            <input
              {...register("firstname", { required: true })}
              className="outline-0   px-1  bg-transparent rounded-bl-md rounded-tr-md  border-[#570DAD] border-2"
              type="text"
              id=""
              placeholder="enter firstname"
            />
            {errors?.firstname && (
              <span className="text-[12.5px] text-[#BE86FF]">
                first name is required
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center items-center">
            <input
              {...register("lastname", { required: true })}
              className="outline-0  px-1   bg-transparent rounded-bl-md rounded-tr-md  border-[#570DAD] border-2"
              type="text"
              id=""
              placeholder="enter lastname"
            />
            {errors?.lastname && (
              <span className="text-[12.5px] text-[#BE86FF]">
                last name is required
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center items-center">
            {" "}
            <input
              {...register("email", { required: true })}
              className="outline-0  px-1  bg-transparent rounded-bl-md rounded-tr-md  border-[#570DAD] border-2"
              type="email"
              id=""
              placeholder="enter email"
            />
            {errors?.email && (
              <span className="text-[12.5px] text-[#BE86FF]">
                email is required
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center items-center">
            <input
              {...register("password", { required: true })}
              className="outline-0  px-1  bg-transparent rounded-bl-md rounded-tr-md  border-[#570DAD] border-2"
              type="password"
              id=""
              placeholder="enter password"
            />
            {errors?.password && (
              <span className="text-[12.5px] text-[#BE86FF]">
                password is required
              </span>
            )}
          </div>
          <button
            type="submit"
            className="py-1 px-2 bg-[#570DAD] text-white rounded font-semibold mt-2 "
          >
            Sign Up
          </button>
          <p>
            if you already have an account{" "}
            <NavLink
              className="underline text-[#BE86FF] uppercase font-semibold"
              to="/login"
            >
              Log in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
