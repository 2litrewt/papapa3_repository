# 若者向けレシピサイト「PaPaPa」 🍳
[![CI Status](https://github.com/2litrewt/papapa3_repository/actions/workflows/ci.yml/badge.svg)](…)
<!-- 後で Coverage バッジや Deploy バッジがあれば追加 -->

**Live:** https://papapa3-repository-auth.vercel.app

## 概要
PaPaPa は「コスト・時間・栄養価」を同時に最適化したい若者向けのレシピ検索アプリです。  
状況（急いでいる・節約したい・栄養を意識したい）に応じて最適レシピを絞り込み、健康的な自炊継続を支援します。

## 特徴
- 🔐 認証機能：CORSを採用したトークンベースログイン（ヘッダ保存/自動リダイレクト）
- 🥗 レシピ検索：材料・コスト・調理時間・栄養観点でフィルタ
- ⭐ お気に入り管理：ユーザー別の保存・一覧
- 🖼️ 画像アップロード：料理画像の保存（S3相当／外部ストレージ準備中）
- 🔍 高速検索基盤：キーワード／条件組み合わせ
- 📱 レスポンシブ UI（Next.js + Tailwind）
- 🚀 CI/CD：GitHub Actions（Lint/TypeCheck/Jest）→ Vercel Auto Deploy

## Quick Start

### Prerequisites
- Node.js 18+
- (Backend API 使用する場合) Ruby 3.2.x & PostgreSQL 14+
- yarn / bundler

### Clone
``` 
git clone https://github.com/2litrewt/papapa3_repository.git
cd papapa3_repository
```

### フロントエンドのみ
```
cd front
yarn install
yarn dev
# http://localhost:3000
```

### バックエンド
```
cd back
bundle install
cp .env.example .env  # 必要なら
bin/rails db:create db:migrate
bin/rails s
```

### Test / Lint
```
cd front
yarn lint && yarn typecheck && yarn test
```

| 画像ファイル名例 | 内容 | ポイント |
|------------------|------|----------|
| `screenshot_home.png` | ホーム（検索導線が見える） | Hero 部分で “3要素最適化” 文言を見せる |
| `screenshot_search.png` | 条件検索 UI | フィルタと結果カード一覧 |
| `screenshot_recipe_detail.png` | レシピ詳細 | 栄養/コスト/時間表示が同一画面にある |
| `screenshot_favorite.png` | お気に入り一覧 | 継続利用の価値 |
| `demo.gif` | 0→検索→保存 の一連操作 | 6〜10 秒、ループ、軽量（<3MB） |
