"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("'Login attempt'", { email, password })
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "omit", // 👈 明示的にCookieや認証情報を送らない
      body: JSON.stringify({
        email,
        password,
      }),
    })

    console.log("レスポンスステータス:", res.status)
    console.log("access-token:", res.headers.get("access-token"))
    console.log("client:", res.headers.get("client"))
    console.log("uid:", res.headers.get("uid"))

    for (let [key, value] of res.headers.entries()) {
      console.log(`${key}: ${value}`)
    }
  
    if (res.ok) {
      const data = await res.json()
      const accessToken = res.headers.get("access-token")
      const client = res.headers.get("client")
      const uid = res.headers.get("uid")
  
      // ここで localStorage に保存
      if (accessToken && client && uid) {
        localStorage.setItem("access-token", accessToken)
        localStorage.setItem("client", client)
        localStorage.setItem("uid", uid)
        localStorage.setItem("user_id", data.data.id.toString())
        localStorage.setItem("name", data.data.name) // 名前も保存
        localStorage.setItem("email", data.data.email)
        window.location.href = "/" // ホームに遷移
      }
    } else {
      const error = await res.json()
      console.error("ログイン失敗:", error)
    }
  }   

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
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

