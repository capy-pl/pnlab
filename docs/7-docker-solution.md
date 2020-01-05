# Docker Solution

專案也提供了利用 Docker deploy 在本地或是雲端的方法。以下簡單闡述了如何使用 Docker 部署這個專案。以下假設你已經將這個專案 pull 下來，並且在本地端安裝好 Docker。

1. 安裝 node.js package（利用 yarn）。

```shell=
yarn
```

2. 產生一個 production build，產生的檔案會在 dist 資料夾下。

```shell
// 這個指令在目前版本會有一些問題 請改用下面的指令
grunt build --production

// 輸入下面這兩個指令
grunt build:client --production
grunt build:server --production
```

3. 進去專案內 Docker 資料夾

```shell=
cd docker
```

4. 利用 docker-compose build image 然後開啟 container。

```shell=
docker-compose up
```

6. 打開瀏覽器，輸入 `localhost:3000`，應該可以看到登入畫面。請詢問其他人帳號密碼，可以開始上傳資料。

## 附註

1. 如果需要從外面連線到 monogodb，可以使用 `27018` port 連線進 container 內的 mongodb。如果要使用現有的資料庫，請在 build 之前在 compose file 裡面設定 volume。
2. 這個方法並不會再更改前端和後端檔案的時候重啟 server 或是 hot module reload，如果需要了話請參見如和建構本地開發環境的文件。
