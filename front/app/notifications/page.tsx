import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// この関数は実際のAPIコールに置き換える必要があります
async function getNotifications() {
  // ダミーデータ
  return [
    { id: 1, title: "'新機能のお知らせ'", content: "'新しいレシピ投稿機能が追加されました。'", date: "'2023-06-01'" },
    { id: 2, title: "'メンテナンスのお知らせ'", content: "'6月5日にシステムメンテナンスを行います。'", date: "'2023-06-03'" },
    { id: 3, title: "'コンテストのお知らせ'", content: "'夏のレシピコンテストを開催します。'", date: "'2023-06-10'" },
  ]
}

export default async function Notifications() {
  const notifications = await getNotifications()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">お知らせ</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader>
              <CardTitle>{notification.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{notification.content}</p>
              <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

