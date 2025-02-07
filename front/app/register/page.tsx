"'use client'"

import { useState } from "'react'"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "'next/link'"

export default function Register() {
  const [username, setUsername] = useState("''")
  const [email, setEmail] = useState("''")
  const [password, setPassword] = useState("''")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで新規登録処理を実装します
    console.log("'Registration attempt'", { username, email, password })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1">ユーザー名</label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
            <Button type="submit" className="w-full">登録</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-600 hover:underline">既にアカウントをお持ちの方はこちら</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

