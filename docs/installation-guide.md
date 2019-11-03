# 如何建構本地端的開發環境

## 前置需求

1. Python3.6 或以上.
2. Node.js 10 或以上.
3. yarn
4. MongoDB
5. RabbitMQ

如果你缺少上面任何一個套件，可以依照下面的指示安裝缺少的套件。如果你是Mac的使用者，可以利用系統內建的`homebrew` 去安裝，在套件管理上會較為方便。

### 安裝 Python
1. [Python下載連結](https://www.python.org/downloads/)。請下載python version 3.6以上。

```bash=
# For mac user
brew install python3
```

### 安裝 Node.js 和 yarn

1. [Node.js下載連結](https://nodejs.org/en/)。安裝LTS版本即可。
```bash=
# For mac user
brew install node@10
```

2. [yarn下載連結](https://yarnpkg.com/lang/en/docs/install/#mac-stable)。這是一個Node.js管理套件的工具，可以用於取代npm。
```bash=
brew install yarn
```

### 安裝 MongoDB

1. [MongoDB下載連結](https://www.mongodb.com/download-center/community).
```bash=
# For mac user
brew install mongodb-community
```
2. 如果你是windows的使用者，下載完安裝檔安裝後，MongoDB應該會自動在背景執行，不需要其他動作。可以打開工作管理員確定是否有在執行。
3. 如果你是mac的使用者而且利用`homebrew`來管理套件時，可能需要另外打以下指令開啟服務。


```bash=
brew services start  mongodb-community
# you can type following command to
# check its status
brew services list
```

### Install RabbitMQ

1. [RabbitMQ下載連結](https://www.rabbitmq.com/download.html).

```bash=
brew install rabbitmq
```

2. 如果你是windows的使用者，安裝後應該會自動在背景執行。
3. 如果你是mac的使用者而且利用`homebrew`安裝，需要打以下指令開啟服務。

```bash=
brew services start  rabbitmq
# you can type following command to
# check its status
brew services list
```

## 設定環境

#### 1. 從github上面clone專案。

```bash=
# ssh
git clone git@github.com:capy-pl/pnlab.git

# https
git clone https://github.com/capy-pl/pnlab.git
```

#### 2. cd 進去專案的folder裡面

```bash=
cd pnlab
```

#### 3. 創造然後啟用python的virtual environment

可以使用任何習慣的套件去做這件事，只需要記得如果你將虛擬環境的資料夾放在專案資料夾底下了話，要將虛擬環境資料夾命名為`env`。以下使用`virtualenv`這個套件做指令的示範。

```bash=
virtualenv env
# or use following command to ensure that
# correct python version is used.
virtualenv -p python3 env

# For windows
.\env\Scripts\activate

# For mac
source env/bin/activate
```

#### 4. 安裝python dependency

註：windows沒辦法直接安裝`python-igraph`這個套件，所以需要利用igraph官方提供的wheel檔案另外安裝。我們已經將官方提供的檔案放在專案資料夾裡面(`pyscript/lib/`)，如果在安裝過程遇到問題，可以利用以下的指令直接安裝。

```bash=
pip install -r requirements.txt

# For windows, you need to install igraph separately.
# python3.6
pip install pyscript/lib/python_igraph-0.7.1.post6-cp36-cp36m-win_amd64.whl
# python 3.7
pip install pyscript/lib/python_igraph-0.7.1.post6-cp37-cp37m-win_amd64.whl
```

#### 5. 安裝 Node.js dependency

```bash=
yarn
```

#### 6. checkout 到development的branch

因為我們最新的更改都會在`dev`這個branch上面，所以如果要使用最新功能，請切換到這個branch。

```bash=
git checkout dev
```

#### 7. 初始化database.

這個指令會將default的系統使用者，和用來寫入資料的schema寫進資料庫裡面。

```bash=
grunt initdb
```

#### 8. 開啟 development server。

```bash=
yarn dev
```

#### 9. 打開瀏覽器，然後在網址列輸入 `localhost:3000`。

應該會看到一個登入畫面，要輸入帳號跟密碼才能登入，請聯絡系統開發（系統管理）者取得帳號密碼。

#### 10. 上傳資料。

一開始資料庫裡面沒有任何交易資料，所以需要將交易資料上傳。

1. 點選navbar右上方顯示使用者email的部分。
2. 選擇下拉式選單中的上傳資料。
3. 點選上傳檔案按鈕。
4. 點擊上傳區域以選擇檔案。
5. 點擊確定，在上傳過程中千萬不要關掉瀏覽器。
6. 等待約莫10 ~ 30分鐘（看機器而定），等到上傳紀錄前面的狀態變成綠色勾勾為止。如果變成錯誤狀態，請聯絡系統開發（系統管理者）。
7. 回到首頁後即可開始新增report。
