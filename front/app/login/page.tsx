"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import apiClient from "@/lib/axios"
import axios from "axios";



export default function Login() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await apiClient.post(
        "/api/auth/sign_in",      // 正しいログインパス
        { email, password },  // ボディはここに渡す
        { withCredentials: true }
      );

      console.log("ステータス:", res.status);                       // 200
      console.log("access-token:", res.headers["access-token"]);     // トークン
      console.log("client:",       res.headers["client"]);
      console.log("uid:",          res.headers["uid"]);

      // レスポンスボディは res.data
      const userData = res.data.data;
      // トークンヘッダを localStorage に保存
      const accessToken = res.headers["access-token"];
      const client      = res.headers["client"];
      const uid         = res.headers["uid"];
      if (accessToken && client && uid) {
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("client",      client);
        localStorage.setItem("uid",         uid);
        localStorage.setItem("user_id",     userData.id.toString());
        localStorage.setItem("name",        userData.name);
        localStorage.setItem("email",       userData.email);
      }

      // ログイン後トップへ
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
       setErrorMessage(error.response?.data.message || "ログインに失敗しました");  
      } else if (error instanceof Error) {
       setErrorMessage(error.message);                                        
      } else {
       setErrorMessage("予期せぬエラーが発生しました");                         
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
        {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="text-red-700 mb-4 bg-white dark:bg-gray-800 p-3 rounded"
            >
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">メールアドレス</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">パスワード</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">ログイン</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-blue-600 hover:underline">新規登録はこちら</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}