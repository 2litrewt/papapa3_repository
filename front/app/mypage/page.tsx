import Link from "'next/link'"
import { Card, CardContent } from "@/components/ui/card"
import { PenSquare, Heart, Bookmark, Users, UserPlus, Settings } from "'lucide-react'"

export default function MyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">マイページ</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/mypage/posted-recipes">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <PenSquare className="w-12 h-12 mb-2" />
              <span>投稿したレシピ</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mypage/liked-recipes">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Heart className="w-12 h-12 mb-2" />
              <span>いいねしたレシピ</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mypage/bookmarked-recipes">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Bookmark className="w-12 h-12 mb-2" />
              <span>ブックマークしたレシピ</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mypage/following">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="w-12 h-12 mb-2" />
              <span>フォロー一覧</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mypage/followers">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserPlus className="w-12 h-12 mb-2" />
              <span>フォロワー一覧</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mypage/settings">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Settings className="w-12 h-12 mb-2" />
              <span>その他</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

