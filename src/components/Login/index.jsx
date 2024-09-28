import { useFormik } from "formik";
import { validationSchemaSignIn } from "../../validation/validation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggedInUser } from "../../fetures/slice/LoginSlice";

const LoginFormCom = ({ toast }) => {
  const dispash = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const auth = getAuth();
  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      signInUser();
    },
    validationSchema: validationSchemaSignIn,
  });

  const signInUser = () => {
    setLoading(true);
    signInWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    )
      .then(({ user }) => {
        if (user.emailVerified === true) {
          dispash(loggedInUser(user));
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Login Successfully");
          let redirect = setTimeout(() => {
            navigateTo("/");
          }, 2000); 
          setLoading(false);
        } else {
          setLoading(false);
          toast.error("Please Verify your email");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Password is incorrect!");
      });
  };

  return (
    <>
      <div>
        <h1 className="mb-6 font-jotiReguler text-center text-[80px]">TalkNest</h1>
        <div className="bg-white shadow-md rounded-sm px-10 py-20 justify-between">
          <form onSubmit={formik.handleSubmit}>
            <label
              htmlFor="email"
              className="text-[#484848] text-[18px] block mb-1 font-interReguler cursor-pointer"
            >
              Enter Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md outline-none mb-4 loading-1"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">
                {formik.errors.email}
              </p>
            ) : null}
            <label
              htmlFor="password"
              className="text-[#484848] text-[18px] block mb-1 font-interReguler cursor-pointer"
            >
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md outline-none mb-5 loading-1"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">
                {formik.errors.password}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white px-3 py-3 rounded-md outline-none text-base font-fontBold"
            >
              {" "}
              {loading ? <SyncLoader color="white" size={10} /> : "Sign In"}
            </button>
          </form>
          <p className="text-[#000000] font-interReguler mt-3 text-base hover:underline">
            <Link className="text-[#236DB0]" to="/forgot-password">
              forgot password?
            </Link>
          </p>
          <p className="text-[#000000] font-interReguler mt-3 text-base ">
            Don't have an account?
            <Link className="text-[#236DB0]" to="/registration">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginFormCom;
