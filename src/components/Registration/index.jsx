import { useFormik } from "formik";
import { validationSchema } from "../../validation/validation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { BeatLoader, SyncLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const RegFormCom = ({ toast }) => {
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      createNewUsers();
    },
    validationSchema: validationSchema,
  });

  const createNewUsers = () => {
    setLoading(true);
    createUserWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    )
      .then(({ user }) => {
        updateProfile(auth.currentUser, {
          displayName: formik.values.name,
        })
          .then(() => {
            sendEmailVerification(auth.currentUser).then(() => {
              toast.success("Registration Successful", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setTimeout(() => {
                navigateTo("/login");
              }, 2000);
              setLoading(false);
            });
          })
          .then(() => {
            set(ref(db, "users/" + user.uid), {
              username: user.displayName,
              email: user.email,
            });
          });
      })
      .catch((error) => {
        if (error.message.includes("auth/email-already-in-use")) {
          toast.error("Email already Exist", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setLoading(false);
        }
      });
  };

  return (
    <>
      <div>
        <h1 className="mb-6 font-jotiReguler text-center text-4xl">TalkNest</h1>
        <div className="bg-white shadow-md rounded-sm px-10 py-20 justify-between">
          <form onSubmit={formik.handleSubmit}>
            <label
              htmlFor="name"
              className="text-[#484848] text-[18px] block mb-1 font-interReguler cursor-pointer"
            >
              Enter Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md outline-none mb-4 loading-1"
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">
                {formik.errors.name}
              </p>
            ) : null}
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
              className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md outline-none mb-4 loading-1"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">
                {formik.errors.password}
              </p>
            ) : null}
            <label
              htmlFor="cpassword"
              className="text-[#484848] text-[18px] block mb-1 font-interReguler cursor-pointer"
            >
              Enter Confirm password
            </label>
            <input
              id="cpassword"
              type="password"
              name="confirmPassword"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md outline-none mb-4 loading-1"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white px-3 py-3 rounded-md outline-none text-base font-fontBold"
            >
              {loading ? <SyncLoader color="white" size={10} /> : "Sign Up"}
            </button>
          </form>
          <p className="text-[#000000] font-interReguler mt-3 text-base ">
            Already have an account?
            <Link className="text-[#236DB0]" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default RegFormCom;
