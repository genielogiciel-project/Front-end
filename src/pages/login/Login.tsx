
// import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import AuthLogin from "../authForms/AuthLogin";
import { Link } from "react-router";

const gradientStyle = {
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const Login = () => {
  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full md:w-96 border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto">
              {/* <FullLogo /> */}
            </div>
            <p className="text-sm text-center text-dark my-3">Sign In on MatDash</p>
            <AuthLogin />
            <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
              <p>New to Matdash?</p>
              <Link to="/register" className="text-primary text-sm font-medium">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
