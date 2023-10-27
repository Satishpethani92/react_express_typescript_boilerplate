import { LoginDto, LoginPayload, UserPayload } from "../types/auth.dto";
import fetcher from "./fetcher";

export const api = {
  signUpUser: (user: UserPayload): Promise<LoginDto> =>
    fetcher(`/service/auth/signup`, "POST", user),
  loginUser: (login: LoginPayload): Promise<LoginDto> =>
    fetcher(`/service/auth/login`, "POST", login),
};
