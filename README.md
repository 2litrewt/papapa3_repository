# 若者向けレシピサイト「PaPaPa」 🍳
[![CI Status](https://github.com/2litrewt/papapa3_repository/actions/workflows/ci.yml/badge.svg)](https://github.com/2litrewt/papapa3_repository/actions)
[![Vercel](https://vercel.com/button)](https://papapa3-repository-auth.vercel.app)
<br>
<br>
<br>
**アプリURL:** https://papapa3-repository-auth.vercel.app/landing
<br>
<br>
<br>

## 目次
- [概要](#概要)
- [特徴](#特徴)
- [クイックスタート](#クイックスタート)
  - [前提条件](#前提条件)
  - [クローン](#クローン)
  - [フロントエンドのみ](#フロントエンドのみ)
  - [バックエンド](#バックエンド)
  - [Test / Lint](#test--lint)
- [スクリーンショット](#スクリーンショット)
- [Tech Stack](#tech-stack)
- [License](#license)  

## 概要
PaPaPa は「コスト・時間・栄養価」を同時に最適化したい若者向けのレシピ検索アプリです。  
状況（急いでいる・節約したい・栄養を意識したい）に応じて最適レシピを絞り込み、健康的な自炊継続を支援します。  
<br>
  
## 特徴
- 🔐 認証機能：CORSを採用したトークンベースログイン（ヘッダ保存/自動リダイレクト）
- 🥗 レシピ検索：材料・コスト・調理時間・栄養観点でフィルタ
- ⭐ お気に入り管理：ユーザー別の保存・一覧
- 🖼️ 画像アップロード：料理画像の保存（S3相当／外部ストレージ準備中）
- 🔍 高速検索基盤：キーワード／条件組み合わせ
- 📱 レスポンシブ UI（Next.js + Tailwind）
- 🚀 CI/CD：GitHub Actions（Lint/TypeCheck/Jest）→ Vercel Auto Deploy  
<br>

## クイックスタート

### 前提条件
- Node.js 18+
- (Backend API 使用する場合) Ruby 3.2.x & PostgreSQL 14+
- yarn / bundler

### クローン
```bash
git clone https://github.com/2litrewt/papapa3_repository.git
cd papapa3_repository
```

### フロントエンドのみ
```bash
cd front
yarn install
yarn dev
# http://localhost:3000
```

### バックエンド
```bash
cd back
bundle install
cp .env.example .env  # 必要なら
bin/rails db:create db:migrate
bin/rails s
```

### Test / Lint
```bash
cd front
yarn lint && yarn typecheck && yarn test
```
<br>

## 環境変数
```bash
# back/.env.example
DATABASE_URL=postgres://postgres@localhost:5432/papapa3_development
SECRET_KEY_BASE=your_secret_key_here
```
<br>

## スクリーンショット

![トップページ](docs/img/top.png)

![検索結果](docs/img/list.png)

![レシピ詳細](docs/img/recipe_detail.png)

![お気に入り一覧](docs/img/favorite.png)

![0→検索→保存 の一連操作](docs/img/20250725.gif)  
<br>


## 🏗 アーキテクチャ

本プロジェクト「PaPaPa」は、**Next.js（フロントエンド）と Ruby on Rails（バックエンド API）を分離した構成**で構築されたモノレポアプリケーションです。  
開発環境では Docker Compose でコンテナを統合管理し、本番環境では Vercel（フロント）と Fly.io（バック）で運用しています。

### ⚙️ システム構成図

```mermaid
graph TD
  A[ブラウザ] -->|HTTP/HTTPS| B[Next.js (front)]
  B -->|REST API / JSON| C[Ruby on Rails API (back)]
  C -->|SQL| D[(PostgreSQL DB)]
  B -.->|認証トークン| C
  E[GitHub Actions] -->|CI/CD| B
  E -->|CI/CD| C
```

### 📁 ディレクトリ構成と役割

| ディレクトリ     | 主な技術                     | 役割                                                    |
|----------------|------------------------------|---------------------------------------------------------|
| `front/`       | Next.js 15 / TypeScript / Tailwind CSS | フロントエンド。レシピ表示・検索・投稿などのUI。AxiosでAPI通信。 |
| `back/`        | Ruby on Rails 7.1 / PostgreSQL          | バックエンドAPI。レシピ・ユーザー・お気に入り管理。Devise Token Authによる認証。 |
| `db/` (コンテナ) | PostgreSQL 14               | 永続データ管理（レシピ・ユーザー・お気に入りなど）                    |
| `/.github/workflows/` | GitHub Actions          | Lint / TypeCheck / Jest テスト → デプロイまでのCI/CDパイプライン             |

### 🔐 認証方式

- `devise_token_auth` を用いたトークンベース認証（ヘッダで `access-token`, `client`, `uid` を送信）
- フロント側はログイン後に localStorage に保存し、認証付きAPIに自動付与

### 🚀 デプロイ環境

| 対象      | サービス   | 備考                          |
|-----------|-------------|-----------------------------|
| フロントエンド | Vercel        | `main` ブランチマージで自動デプロイ |
| バックエンド | Fly.io         | `back-main` 環境として稼働            |
| DB         | Fly Postgres    | Rails APIと同一リージョンでホスト |


## Tech Stack
- **フロントエンド:** Next.js 15 · TypeScript · Tailwind CSS  
- **バックエンド:** Ruby on Rails 7.1 · PostgreSQL 14  
- **インフラ & CI/CD:** Vercel · GitHub Actions  
- **テスト:** ESLint · Jest (smoke test) · TypeScript strict


## License
This project is licensed under the [MIT License](LICENSE).
