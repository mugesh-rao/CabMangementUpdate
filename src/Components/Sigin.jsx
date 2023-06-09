import React, { useEffect } from "react";
import { useState } from "react";
import Logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedEmail && storedPassword) {
      setFormData({ email: storedEmail, password: storedPassword });
      setRememberMe(true);
    }
  }, []);

  function onRememberMeChange(e) {
    setRememberMe(e.target.checked);
  }

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        localStorage.setItem("loginAuth", "true");
        setTimeout(function () {
          navigate("/Home");
        }, 1000);
        toast.success("Logged In Successfully");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Wrong Admin credentials 😒.");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <section class="bg-gray-900  ">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div class="flex flex-col items-center text-2xl font-semibold text-white">
            <img class="w-24 h-16 " alt="hello" src={Logo} />
            <span className="text-xl font-sf_bold capitalize">
              Chennai cabs
            </span>
            <span className="text-[9px] font-sf_regular align-right capitalize">
              one way drop taxi
            </span>
          </div>
          <div class="w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl  leading-tight tracking-tight text-center text-white md:text-2xl ">
                Admin Login
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-50 "
                  >
                    {" "}
                    Email
                  </label>
                  <input
                    id="email"
                    autoComplete="on"
                    type="email"
                    value={email}
                    onChange={onChange}
                    style={{ zIndex: 1000 }}
                    placeholder="Enter Your Mail"
                    class=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-50 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="on"
                    id="password"
                    value={password}
                    onChange={onChange}
                    style={{ zIndex: 1000 }}
                    placeholder="••••••••"
                    class=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-start">
                    <label htmlFor="remember" className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                        onClick={onRememberMeChange}
                      />
                      <span className="ml-2 text-sm text-white ">
                        Remember me
                      </span>
                    </label>
                  </div>
                  <div
                    href="#"
                    class="text-sm font-medium  hover:underline text-white"
                  >
                    Forgot password?
                  </div>
                </div>
                <button
                  type="submit"
                  class="w-full text-white bg-[#00adb5] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 py-2.5 text-center "
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
