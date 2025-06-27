import api from "../api";

export const refreshToken = async (): Promise<boolean> => {
  try {
    await api.post("/token/refresh");
    return true;
  } catch {
    return false;
  }
};
