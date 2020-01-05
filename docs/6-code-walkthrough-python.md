# 分析服務開發和架構簡介

## 技術簡介

因為圖形分析仰賴Python的一些計算library，所以開發語言跟執行環境都使選用Python。這個分析服務利用python multiprocess worker pool的功能，在開啟時會根據CPU的數量產生出對應的python worker，每個worker都會向message queue註冊，並且等待新的訊息傳入。依據訊息內容做相對應的工作。

### Technology Stack

分析服務用到的一些技術。

* Python3.7
* python-igraph
* pandas
* pymongo(driver for MongoDB)
* Worker Pool

## 程式碼架構簡介

```
pyscript
├── lib
├── src
│   ├── model
│   ├── preprocessing
│   ├── task
│   ├── __init__.py
│   ├── argparser.py
│   ├── error.py
│   ├── logger.py
│   ├── mongo_client.py
│   ├── utils.py
│   └── worker.py
├── __init__.py
└── index.py
```

* **lib** 裡面有igraph的whl檔案，因為windows無法直接利用pip做安裝，因此可以直接使用提供的whl安裝igraph套件。
* **src** 是這個專案的核心模組，裡面又分為數個模組。
  * **model** 裡面有開發中會用到的model。目前只有`product network`跟`promotion`。
  * **preprocessing** 這個模組包含了如何將原始csv轉換成產品網路中，數個會應用到的class。
  * **task**裡面包含了分析服務會執行的功能。目前有import csv跟生成網路圖兩項服務。
  * **worker.py** 是主要程式的進入點。
  * 其餘檔案就不一一介紹。

## 如何開發

分析服務有兩種開發方法，在編輯python檔案之後，如果你目前有輸入過`npm run dev`並且停留在那個視窗，只要在視窗內輸入`rs`，server和分析服務就會重新啟動，可以利用已經有的Web UI去觸發功能。另外因為目前是利用python的multiprocessing的模組，所以在視窗內並不會直接看到output，
如果想看程式時的執行時的錯誤，可以打開`${HOME}/pnlab/logs/pn-python.log`閱讀錯誤資訊。

另外因為以上方法較為麻煩，所以另外提供了一個可以利用command line觸發的tool（請見下一節），讓debug上面可以直接利用這個command line tool去做debug。

## pntool.py

```
usage: pntool [-h] [-r [report id]] [-i [file path]] [-c [file path]] [-t]

The program provides serveral commands to help user to trigger some action by
using command line tools. The tool will be extremely useful for debugging or
when message queue is not available.

optional arguments:
  -h, --help            show this help message and exit
  -r [report id], --report [report id]
                        Run an network analysis on the given report id.
  -i [file path], --import [file path]
                        Import transaction data from given file path.
  -c [file path], --create-user [file path]
                        Create a new user.
  -t, --test-mq         test mq connection
```

### Example

#### 針對已經創建的report進行網路分析

```bash
# A report must be first created in the default database.
python pntool.py -r 5dbff46f0ad064834baf7182
```

#### 將特定檔案輸入到default的資料庫內

```bash
python pntool.py -i customer.csv
```