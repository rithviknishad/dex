import { useEffect } from "react";
import { Auth } from "../API";
import { handleFireRequestError } from "../API/fireRequest";
import { BillingAccount } from "../API/models/JWTAuth";
import { atom, useAtom } from "jotai";

const AUTH_REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_ACCESS_TOKEN_KEY = "access_token";
const TOKEN_REFRESH_INTERVAL = 60e3;

export const authProfileAtom = atom<BillingAccount | null>(null);

export default function useJWTAuth() {
  const [account, setAccount] = useAtom(authProfileAtom);

  useEffect(() => {
    addEventListener("storage", (e) => {
      if (e.key !== AUTH_ACCESS_TOKEN_KEY) return;

      if (e.newValue) {
        Auth.profile
          .read()
          .then((res) => {
            if (res.status === 200) setAccount(res.data);
          })
          .catch(
            handleFireRequestError((error) => {
              if (error.response?.status === 401) signout();
              console.error(error.response);
            })
          );
      } else {
        window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        setAccount(null);
      }
    });
  }, []);

  const authenticated = !!tokens().access;

  useEffect(() => {
    if (authenticated) {
      const interval = setInterval(() => {
        refreshToken();
      }, TOKEN_REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [authenticated]);

  return { authenticated };
}

export const login = async (email: string, password: string) => {
  const res = await Auth.tokenCreate(email, password);

  if (res.status === 200) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, res.data.refresh);
    localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, res.data.access);
    window.location.href = "/";
  }

  return res;
};

export const refreshToken = async () => {
  const { access, refresh } = tokens();

  if (!access || !refresh) {
    signout("/session-expired");
    return;
  }

  const res = await Auth.tokenRefreshCreate(refresh);
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, res.data.access);
};

export const signout = (target = "/") => {
  localStorage.clear();
  window.location.href = target;
};

export const tokens = () => {
  return {
    access: localStorage.getItem(AUTH_ACCESS_TOKEN_KEY),
    refresh: localStorage.getItem(AUTH_REFRESH_TOKEN_KEY),
  };
};
