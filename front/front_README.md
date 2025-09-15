# PaPaPa Frontend

Next.js 15 + TypeScript + Tailwind CSS を使用したフロントエンドです。  
API 通信は axios を使用し、バックエンド Rails API と連携します。  
Vercel でホスティングされています。

## 🚀 セットアップ（ローカル）
```bash
cd front
yarn install
yarn dev
# http://localhost:3000
```

## 🐳 Docker Compose での起動
```bash
docker compose up front
# http://localhost:3000
```

## 🧩 主な技術
- Next.js 15
- TypeScript
- Tailwind CSS
- axios（API 通信）
- ESLint / Jest（テスト）

## 📁 ディレクトリ構成（抜粋）
- `app/` — ページルーティング
- `components/` — 再利用コンポーネント（UIなど）
- `context/` — グローバル状態管理（認証など）
- `lib/` — API クライアント設定
- `public/` — 画像・アイコンなどの静的ファイル

## 📝 備考
- ログイン後は `access-token`, `client`, `uid` を localStorage に保存し、認証APIに付与します
- GitHub Actions による Lint / TypeCheck / Jest 実行後、`main` ブランチが Vercel に自動デプロイされます


## 📂 ディレクトリ構成（概要）

```
front/
├── app/                     # ページルーティング（page.tsxなど）
│   ├── layout.tsx
│   └── page.tsx
├── components/               # UIコンポーネント（MenuBar, Footer など）
├── context/                  # グローバル状態（useAuth など）
├── lib/                      # APIクライアント設定（axios など）
├── public/                   # 画像・アイコン
├── styles/                   # グローバルCSS
├── jest.config.js             # Jest設定
├── tsconfig.json               # TypeScript設定
└── yarn.lock
```


## 🔍 逆引き：◯◯を変更したい時どこを見る？

| やりたいこと                         | 見る場所 / 補足 |
|--------------------------------------|------------------|
| フッターのリンク・SNSアイコン変更     | `components/Footer.tsx` |
| メニューの表示（ログイン時の切替）    | `components/MenuBar.tsx` / `context/AuthContext.tsx` |
| レシピ一覧の検索条件を増やす          | `app/search/*` / `lib/apiClient.ts` |
| APIのベースURLを変える               | `lib/apiClient.ts`（環境変数 `.env` 連動） |
| レシピカードの見た目を調整           | `components/RecipeCard.tsx`（仮） |

## 🌐 Routes (Front)

| Path              | 役割              |
|-------------------|-------------------|
| `/`               | ホーム            |
| `/landing`        | LP                |
| `/search`         | レシピ一覧/検索   |
| `/recipe/[id]`    | レシピ詳細        |
| `/login`          | ログイン          |
