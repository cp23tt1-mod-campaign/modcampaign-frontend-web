import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  const navigate = useNavigate();

  // const [count, setCount] = useState(0);

  const googleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      handleGoogleSignIn(tokenResponse.access_token),
    onError: () => console.log("Login Failed"),
  });

  const handleGoogleSignIn = async (token) => {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      );
      const userData = await googleResponse.data;
      // console.log(user);
      const responseAPI = await axios.post(
        `${import.meta.env.VITE_API_URL}/sign-in`,
        {
          email: userData.email,
        }
      );
      const { status } = responseAPI.data.data;
      // eslint-disable-next-line no-unsafe-optional-chaining
      const role = responseAPI.data?.data?.data?.role;
      console.log(status, role);
      if (status === "found") {
        if (role && role === "Admin") {
          await Swal.fire({
            icon: "success",
            title: `Login Successful`,
            showCancelButton: false,
            showConfirmButton: false,
            type: "success",
            allowOutsideClick: false,
            timer: 2000,
          });
          const userData = responseAPI.data.data.data;
          localStorage.setItem("accessToken", userData.accessToken);
          console.log(userData);
          console.log(userData.accessToken);
          console.log(userData.role);
          console.log(userData.displayName);
          console.log(userData.profileImage);
          // https://lh3.googleusercontent.com/a/${userProfile?.profileImage}
          navigate("/");
          // window.location.href = "/dashboard";
        } else {
          Swal.fire({
            icon: "error",
            title: `Access Denied`,
            text: "This account does not have administrative privileges.",
            showConfirmButton: true,
            customClass: "warning confirm",
            confirmButtonText: "OK",
            type: "error",
            allowOutsideClick: false,
          });
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: `Error`,
          text: "This account does not register in system.",
          showConfirmButton: true,
          customClass: "warning confirm",
          confirmButtonText: "OK",
          type: "error",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full md:w-screen h-full md:h-screen bg-white flex flex-col">
      <div className="my-6 flex w-full ml-10 md:ml-0 md:justify-around">
        <div className="text-header-3 font-bold text-black">ModCampaign</div>
        <div></div>
      </div>
      <div className="flex md:flex-row flex-col justify-center items-center space-x-16 w-full h-full pb-3">
        <img
          src="../src/assets/loginPic.svg"
          alt="loginPic"
          // className="w-[55.75rem] h-[58.625rem]"
          className="w-full md:w-1/3 max-h-[58.625rem] select-none"
          data-aos="fade-right"
          data-aos-easing="ease-in-sine"
          data-aos-duration="800"
        />
        <div
          className="flex flex-col justify-center w-full md:w-1/3 h-full px-10 md:px-0 space-y-16"
          data-aos="fade-left"
          // data-aos-offset="1000"
          data-aos-duration="1200"
        >
          <div className="w-full flex flex-col space-y-3">
            <span className="text-black font-bold text-[2.5rem]">
              Welcome to
            </span>
            <span className="text-orange font-bold text-[3.5rem]">
              ModCampaign
            </span>
            <span className="text-orange font-bold text-[3.5rem]">
              User Management
            </span>
            <span className="text-gray text-header-4 font-semibold">
              This website is for authorized administrators only. <br />
              Please log in to continue.
            </span>
          </div>
          <div
            onClick={() => {
              const accessToken = localStorage.getItem("accessToken");
              if (accessToken) {
                navigate("/");
              } else {
                googleSignIn();
              }
            }}
            className="bg-orange hover:bg-orange-hover rounded-3xl w-9/12 flex justify-center items-center py-2.5 space-x-5 cursor-pointer select-none"
          >
            <img
              src="../src/assets/googleIcon.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-white text-header-4 font-bold">
              Log in with google
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
