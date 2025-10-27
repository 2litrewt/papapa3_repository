import axios from "axios";

const isServer = typeof window === "undefined";

// axiosのクライアント作成
const apiClient = axios.create({
  baseURL: isServer
  ? (process.env.NODE_ENV === "development"
      ? "http://back:3000"
      : (process.env.NEXT_PUBLIC_API_URL || "https://back-main.fly.dev"))
      : (process.env.NEXT_PUBLIC_API_URL || "https://back-main.fly.dev"),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストのinterceptor部分　localStorageからトークンを自動でつける
apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      const client = localStorage.getItem("client");
      const uid = localStorage.getItem("uid");

      console.log("apiClientの中身", Object.keys(apiClient));

      if (token && client && uid) {
        config.headers["access-token"] = token;
        config.headers["client"] = client;
        config.headers["uid"] = uid;
      }
      return config;
});

// レスポンスのインターセプター部分　新しいトークンが来たら保存し直す
apiClient.interceptors.response.use((response) => {
  const newToken = response.headers["access-token"];
  const newClient = response.headers["client"];
  const newUid = response.headers["uid"]

  if (newToken && newClient && newUid) {
    localStorage.setItem("access-token", newToken);
    localStorage.setItem("client", newClient);
    localStorage.setItem("uid", newUid);
  }

  return response;
});

export default apiClient;