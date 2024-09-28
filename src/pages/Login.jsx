import LoginFormCom from "../components/Login";
import { ToastContainer, toast } from "react-toastify";
const Login = () => {
  return (
    <>
      <ToastContainer />
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-[560px]">
          <div className="w-full">
            <LoginFormCom toast={toast} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
