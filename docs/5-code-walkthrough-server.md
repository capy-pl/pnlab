# 後端開發和架構簡介

## 技術簡介

本專案的後端同樣使用了TypeScript，執行環境則是選擇了Node.js。為了輕易的部署到生產環境，同樣使用了webpack做打包工具。框架則選用了Express.js，因為其輕量化的資源庫，讓後端客製化程度十分高。

### Technology Stack

將後端端用到的一些技術做條列。

* Node.js
* Express.js
* Mongoose(ORM for MongoDB)
* PM2(部署相關)
* websocket
* JWT(authentication)
* webpack

## 程式碼架構簡介

```
server
├── api
├── core
├── migrations
├── models
├── static
├── templates
├── App.ts
├── index.d.ts
└── index.ts
```

* **api** 資料夾包含了每一支api的後端模組。每一個api模組內又包含了一個`route.ts`跟`controller.ts`檔案。`route.ts`主要讓開發者將url對應到每一個control function。`controller.ts`則是撰寫handle request邏輯的地方。
* **core** 資料夾儲存了後端核心模組。裡面有middleware, db, authentication, websocket等等小模組。
* **migrations** migration裡面有開發者自行撰寫的migration檔案，如果未來開發上有需要更動先前的db設計，則需要撰寫新的migration file。server會在每次開啟時自動檢查有沒有更新到最新的migration。
* **models** 後端所使用到的model。
* **static** 一些靜態檔案，例如圖片等等。
* **templates** 初始的HTML檔案。（會經由webpack HTML plugin讀取更改後自動載入最新bundle的檔案）
* **App.ts** 初始化一個express app的地方。
* **index.ts** 後端的entry point。

## 如何開發

輸入以下指令

```
npm run dev
```

後端在開發上有使用nodemon做reload，所以每次後端檔案有更改時，server會自動重新開啟。
