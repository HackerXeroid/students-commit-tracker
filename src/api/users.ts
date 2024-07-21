import axiosInstance from "./index";

type UserRegisterReq = {
  name: string;
  email: string;
  password: string;
};

const RegisterUser = async (userData: UserRegisterReq) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/auth/register",
      userData
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

type UserLoginReq = {
  email: string;
  password: string;
};

const LoginUser = async (userData: UserLoginReq) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/login", userData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export { RegisterUser, LoginUser, GetCurrentUser };
