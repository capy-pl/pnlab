# Docker Solution

專案也提供了利用Docker deploy在本地或是雲端的方法。以下簡單闡述了如何使用Docker部署這個專案。以下假設你已經將這個專案pull下來，並且在本地端安裝好Docker。

1. 安裝node.js package（利用yarn）。

```shell=
yarn
```

2. 產生一個production build，產生的檔案會在dist資料夾下。

```shell
grunt build:prod
```

3. 進去專案內Docker資料夾

```shell=
cd docker
```

4. 利用docker-compose build image然後開啟container。

```shell=
docker-compose up
```

6. 打開瀏覽器，輸入 `localhost:3000`，應該可以看到登入畫面。請詢問其他人帳號密碼，可以開始上傳資料。

## 附註

1. 如果需要從外面連線到monogodb，可以使用 `27018` port 連線進container內的mongodb。如果要使用現有的資料庫，請在build之前在compose file裡面設定volume。
2. 這個方法並不會再更改前端和後端檔案的時候重啟server或是hot module reload，如果需要了話請參見如和建構本地開發環境的文件。
