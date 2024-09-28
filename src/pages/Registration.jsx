import RegFormCom from "../components/Registration";
import { ToastContainer, toast } from "react-toastify";

const Registration = () => {
  return (
    <>
      <ToastContainer />
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-[560px]">
          <div className="w-full">
            <RegFormCom toast={toast} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
