import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { login, logout, refreshToken } from "../redux/authSlice";

export const useAuth = (ok: boolean = true) => {
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  let refresh = true;

  useEffect(() => {
    refresh && ok && dispatch(refreshToken());
    refresh = false;
  }, []);

  return { user, token, error, loading, dispatch, login, refreshToken, logout };
};
