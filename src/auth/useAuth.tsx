import { useEffect } from "react";
import { login, logout, refreshToken } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export const useAuth = (ok: boolean = true) => {
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  let refresh = true;

  useEffect(() => {
    // refresh && ok && dispatch(refreshToken());
    refresh &&
      ok &&
      dispatch(
        refreshToken({
          userNumber: user?.userNumber as string,
          password: user?.password as string,
        })
      );
    refresh = false;
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    error,
    loading,
    dispatch,
    login,
    refreshToken,
    logout,
  };
};
