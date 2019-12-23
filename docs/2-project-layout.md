# 專案架構

以下是本專案的系統架構圖，專案組成主要有三個部分（冒號後為所使用到的技術）。

1. 前端：TypeScript, React
2. 後端：Node.js, TypeScript
3. 分析服務：Python 3.7

## 架構介紹

前端主要採用SPA的方式寫成，所以在路徑轉換跟頁面渲染由JavaScript內的邏輯做控制。後端的功能只負責提供靜態檔案和作為一個Restful API Server。(未來可以考慮將提供靜態檔案的功能分開作為獨立的服務)。在網路圖分析上本專案仰賴Python的套件，所以基於效率跟服務部署的考量，額外建立一個利用Python寫成的分析服務，這個服務目前主要負責輸入資料跟網路圖分析。資料庫的部分則是採用了MongoDB。
    
為了讓API Server和分析服務的溝通能夠擁有災難回復、負載平衡等機制，本專案使用RabbitMQ作為兩個服務中的message queue，讓其控管兩個行程中的溝通訊息。


![](https://i.imgur.com/sKPxHuC.png)