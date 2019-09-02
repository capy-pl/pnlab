import { Server } from 'http';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import { Report, ImportHistory } from '../../models';
import url from 'url';

async function askReportStatus(wsMap: Map<string, WebSocket>) {
  const keys: string[] = [];
  wsMap.forEach((value, key) => {
    keys.push(key);
  });
  const reports = await Report.find(
    {
      _id: {
        $in: keys,
      },
    },
    {
      status: 1,
    },
  );
  if (reports && reports.length) {
    reports.forEach((report) => {
      const ws = wsMap.get(report._id.toString());
      if (ws) {
        ws.send(report.status);
      }
    });
  }
}

async function askImportHistoryStatus(wsMap: Map<string, WebSocket>) {
  const keys: string[] = [];
  wsMap.forEach((value, key) => {
    keys.push(key);
  });
  const histories = await ImportHistory.find(
    {
      _id: {
        $in: keys,
      },
    },
    {
      status: 1,
    },
  );
  if (histories && histories.length) {
    histories.forEach((history) => {
      const ws = wsMap.get(history._id.toString());
      if (ws) {
        ws.send(history.status);
      }
    });
  }
}

function ReportWSServer(): WebSocket.Server {
  const wss = new WebSocket.Server({ noServer: true });
  const wsMap = new Map<string, WebSocket>();
  wss.on('connection', (ws) => {
    let reportId: string | undefined;
    ws.on('message', (data) => {
      const id = data as string;
      reportId = id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        wsMap.set(id, ws);
      } else {
        ws.send('Invalid id');
      }
    });
    ws.on('close', () => {
      if (reportId) {
        wsMap.delete(reportId);
      }
    });
  });

  setInterval(() => {
    askReportStatus(wsMap);
  }, 2000);
  return wss;
}

function ImportHistoryWSServer(): WebSocket.Server {
  const wss = new WebSocket.Server({ noServer: true });
  const wsMap = new Map<string, WebSocket>();
  wss.on('connection', (ws) => {
    let historyId: string | undefined;
    ws.on('message', (data) => {
      const id = data as string;
      historyId = id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        wsMap.set(id, ws);
      } else {
        ws.send('Invalid id');
      }
    });
    ws.on('close', () => {
      if (historyId) {
        wsMap.delete(historyId);
      }
    });

    setInterval(() => {
      askImportHistoryStatus(wsMap);
    }, 2000);
  });
  return wss;
}

function startSocketServer(server: Server) {
  server.on('upgrade', (request, socket, head) => {
    const wss1 = ReportWSServer();
    const wss2 = ImportHistoryWSServer();
    const pathname = url.parse(request.url).pathname;

    switch (pathname) {
      case '/report':
        wss1.handleUpgrade(request, socket, head, (ws) => {
          wss1.emit('connection', ws);
        });
        break;
      case '/upload':
        wss2.handleUpgrade(request, socket, head, (ws) => {
          wss2.emit('connection', ws);
        });
        break;
      default:
        socket.destroy();
        break;
    }
  });
}

export default startSocketServer;
