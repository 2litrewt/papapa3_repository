import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  "ご飯", "麺", "煮物", "焼き物", "揚げ物", "サラダ", "スープ", "デザート"
]

const tags = [
  "冷たい", "温かい", "しょっぱい", "甘い", "辛い", "さっぱり", "こってり", "ヘルシー",
  "ボリューミー", "簡単", "時短", "おもてなし", "お弁当", "朝食", "昼食", "夕食",
  "おつまみ", "パーティー", "おやつ", "ダイエット", "筋トレ", "ベジタリアン", "ヴィーガン", "グルテンフリー",
  "低糖質", "高タンパク", "低カロリー", "高カロリー", "洋風", "和風", "中華風", "エスニック"
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-6xl font-bold text-center mb-8">
        <span className="logo">PaPaPa</span>
      </h1>
      <div className="mb-8">
        <form className="space-y-4" action="/search">
          <div className="flex gap-2">
            <Input type="text" name="query" placeholder="料理名や材料を入力" className="flex-grow border-2 border-black" />
            <Button type="submit" className="border border-black">検索</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select name="time">
              <SelectTrigger className="border border-black">
                <SelectValue placeholder="調理時間" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">30分以内</SelectItem>
                <SelectItem value="medium">30分〜1時間</SelectItem>
                <SelectItem value="long">1時間以上</SelectItem>
              </SelectContent>
            </Select>
            <Select name="price">
              <SelectTrigger className="border border-black">
                <SelectValue placeholder="価格帯" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">~500円</SelectItem>
                <SelectItem value="medium">500円~1000円</SelectItem>
                <SelectItem value="high">1000円~</SelectItem>
              </SelectContent>
            </Select>
            <Select name="nutrition">
              <SelectTrigger className="border border-black">
                <SelectValue placeholder="栄養" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low_calorie">低カロリー</SelectItem>
                <SelectItem value="high_protein">高タンパク</SelectItem>
                <SelectItem value="low_carb">低糖質</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">料理カテゴリ</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link href={`/search?category=${category}`} key={category}>
              <div className="bg-white border border-gray-200 border-black p-4 rounded-lg text-center hover:bg-gray-100 transition-colors dark:border-gray-800">
                {category}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">タグ</h2>
        <div className="grid grid-cols-8 gap-2">
          {tags.map((tag) => (
            <Link href={`/search?tag=${tag}`} key={tag}>
              <div className="bg-white border border-gray-200 border-black p-2 rounded text-center text-sm hover:bg-gray-100 transition-colors dark:border-gray-800">
                {tag}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

