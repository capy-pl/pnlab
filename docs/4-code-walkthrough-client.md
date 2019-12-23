# 前端開發和架構簡介

## 技術簡介

本專案的前端主要使用TypeScript寫成，整體架構採用了single page application的方式。在前端框架上面採用了React，UI Framework則是使用了Sematic UI。管理模組跟TypeScript轉譯則是使用了webpack跟babel。

### Technology Stack

將前端用到的一些技術做條列。

* React
* React-router-dom
* Sematic UI
* SCSS
* TypeScript
* Babel
* Webpack

### 部分套件簡介

#### Webpack

前端使用webpack做檔案打包，並且利用dynamic import做code splitting，改善前端載入的效能。

#### Storybook

近年來前端十分流行component based的開發，storybook給予開發者一個分離的環境來測試使用者撰寫的每一個component。

## 程式碼架構簡介

```
client
├── scss
└── ts
    ├── PnApp
    ├── components
    ├── pages
    ├── stories
    ├── index.d.ts
    └── index.tsx
```

* **scss** 資料夾主要儲存了scss檔案。
* **ts** 資料夾主要儲存了主要TypeScript的檔案，裡面資料夾又可以依據功能分成下面4個。
    * **PnApp** 核心模組。一些相關的model、authentication和graph等等功能都在此資料夾內。
    * **components** 不同頁面中會共用的component主要放置在這。
    * **pages** 掌控頁面layout的資料夾。這個資料夾內的每個檔案都代表了一個頁面。每一個資料夾則代表了在同一個url下的子頁面。例如url`/report`下面包含了`/report/add`和`/report/<id>`，都會被放在`report`這個資料夾內，檔案名稱則分別為`Add.tsx`和`Detail.tsx`。
    * **stories** storybook所讀取的資料夾。
* **index.tsx** 前端檔案的進入點。

## 如何開發

1. 如果有pull最新的更改，或是剛將專案pull下來，需要使用以下command做一些初始化配置。

```
// 將舊有檔案刪除
grunt clean:client

// bundle最新的檔案跟更新html
grunt build:client
```

2. 開啟development server。可以開啟development server。

```
npm run dev
```

如果不會更動到後端的檔案，可以考慮使用以下command，可以增加開啟server的速度（推薦在windows上面使用）。

```
// bundle最新的後端檔案
grunt build:server

// 用Node.js開啟development server。
npm run ndev
```

## 程式碼風格管理

專案有使用`eslint`跟`prettier`做風格管理，如果有使用vscode，請安裝`prettier`套件。