import { toast } from "react-toastify";
import { LoginDto } from "../types/auth.dto";

declare type MethodType =
  | "GET"
  | "POST"
  | "PUT"
  | "POST"
  | "DELETE"
  | "get"
  | "post"
  | "put"
  | "post";

const AlertMaker = async (res: Response, showAlert = true) => {
  const altRes = res.clone();

  const data = await altRes.json();
  if (showAlert) {
    if (data) {
      if (data.status && data?.message) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      toast.error("Something Went Wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return res;
};

const fetcher = async (
  url: string,
  method: MethodType = "GET",
  data: object = {},
  showAlert = true
) => {
  const requestHeader = new Headers();

  const LocalUser: LoginDto =
    JSON.parse(localStorage.getItem("auth")!) || undefined;
  if (method.toLowerCase() !== "get") {
    requestHeader.append("Content-Type", "application/json");
  }

  if (LocalUser) {
    requestHeader.append("Authorization", `Bearer ${LocalUser.token}`);
  }

  const params: RequestInit = {
    headers: requestHeader,
    cache: "default",
  };

  if (method.toLowerCase() !== "get") {
    params.method = method;
    params.body = JSON.stringify(data);
  }

  const URL =
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : `${window.location.origin}`
    }` + url;

  const response = await fetch(URL, {
    ...params,
  }).then((e) => AlertMaker(e, showAlert));

  const response_1 = await response.json();
  return response_1?.data ? response_1?.data : response_1?.status;
};

export default fetcher;
