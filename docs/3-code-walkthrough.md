# 程式架構簡介

## 目錄架構

```
├── .storybook
├── .vscode
├── aws
├── certificates
├── client
├── config
├── dist
├── docker
├── docs
├── pyscript
├── server
├── spec
├── task
├── .babelrc
├── .dockerignore
├── .env
├── .gitignore
├── Gruntfile.js
├── README.md
├── ecosystem.config.js
├── index.py
├── package.json
├── pntool.py
├── requirements.txt
├── tsconfig.json
├── yarn-error.log
└── yarn.lock

13 directories, 14 files
```

這是專案根目錄下包含的資料夾跟檔案，以下會先做一個簡單介紹，詳細的資料會分別在其餘文件中提及。資料夾跟檔案可以大致分成以下5個類別：

1. 開發使用
2. 測試（沒在用）
3. Distribution用
4. 系統配置相關檔案
5. 其餘工具

## 1. 開發使用

開發使用的專案資料夾包括了以下三個資料夾以及一個檔案。

```
├── client
├── pyscript
├── server
├── index.py
└── pntool.py

3 directories, 2 files
```

開發使用所包含的資料夾主要是當需要改動**系統功能**或是**前端頁面**的時候會碰到的主要檔案所在。

* **client** 資料夾主要儲存了前端的相關檔案，詳細資料可以見[前端程式碼架構]()。
* **server** 資料夾主要儲存了所有後端檔案，詳細資料可以見[後端程式碼架構]()。
* **pyscript** 資料夾跟**index.py**是要執行分析服務所需要的所有程式碼。**index.py**是提供主程式一個進入點，所以需要服務的時候只要直接執行`python index.py`就可以啟動分析服務。詳細介紹可以見[分析服務架構]()。
* **pntool.py**是可以直接執行單一服務的command line tool。因為分析服務會需要從message queue內收到指令後才會執行服務，在開發上或是debug較為麻煩，而且如果使用者只需要針對單一檔案進行個別操作的時候，也十分不便。`pntool.py`提供一個可以透過command line直接執行分析服務功能的工具。詳細可以見[pntool介紹]()。

## 2. 測試(沒有使用)
```
├── spec
```

測試的相關檔案都在spec這個資料夾內，因為本次專案僅一開始有撰寫部分unit test，後續都沒有執行，所以這個資料夾就沒有被使用到。未來如果有需要新增測試，可以基於這個資料夾繼續撰寫。

## 3. Distribution用
```
├── dist
    ├── client
    ├── server
    ├── .env
    └── package.json

```

**dist**資料夾是當每次專案有更新時，需要利用webpack重新產生新的bundle和更新成最新的package.json。當需要將程式部署到生產環境時，應該僅需要使用這個資料夾。

## 4. 系統配置相關檔案
```
├── .storybook
├── .vscode
├── aws
├── certificates
├── config
├── docker
├── .babelrc
├── .dockerignore
├── .env
├── .gitignore
├── ecosystem.config.js
├── package.json
├── requirements.txt
├── tsconfig.json
└── yarn.lock
```

* **.storybook** 資料夾是儲存一個前端UI套件storybook的一些設定。
* **.vscode** 資料夾儲存了vscode的設定。
* **aws**資料夾儲存了要利用Elastic Beanstalk部署專案到AWS上面的一些相關檔案。（預設是先利用ECR上傳image，然後利用ECS部署）
* **certificates**是儲存伺服器憑證跟私鑰的資料夾，在生產環境應該要將其放入環境變數中而不是當地的檔案。目前僅放置測試用的憑證跟金鑰。
* **config** 儲存專案使用webpack的config檔案。
* **docker** 專案需要透過docker部署的必要檔案。可以幫專案分別產生image。替後端跟分析服務分別撰寫了docker image。
* **.babelrc** 是babel的相關config檔案。
* **.dockerignore** 是docker build image的時候，在build contet中可以忽略的所有檔案跟資料夾。
* **.env** 一些專案中需要的環境變數（開發用）。
* **.gitignore** 版本管理git可以忽略的檔案跟資料夾。
* **ecosystem.config.js** 生產環境中，給`pm2`這個process manager的config檔案。
* **package.json** npm管理套件所需要使用的檔案。（本專案預設使用yarn作為套件管理工具）
* **requirements.txt** Python套件管理工具pip所需要使用的檔案。
* **tsconfig.json** TypeScript所需要的config檔案。專案前後端都使用TypeScript，所以需要此檔案針對TypeScript做一些設定。
* **yarn.lock** yarn所使用的套件版本管理檔案。

## 5. 其餘工具

```
├── task
└── Gruntfile.js
```

專案有另外使用**Grunt**這個task runner自動化執行一些task。
* **task**這個資料夾是儲存一些額外的指令的script。script預設是利用TypeScript執行。但也可以用其餘語言寫成，只需要在Gruntfile.js裡面設定就好。
* **Gruntfile.js** 是有關Grunt的一些設定。