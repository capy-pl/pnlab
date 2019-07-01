import { Server } from 'http';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import { Report } from '../../models';

async function askStatus(wsMap: Map<string, WebSocket>) {
  const keys: string[] = [];
  wsMap.forEach((value, key) => {
    keys.push(key);
  });
  const reports = await Report.find({
    _id: {
      $in: keys,
    },
  }, {
      status: 1,
  });
  if (reports && reports.length) {
    reports.forEach((report) => {
      const ws = wsMap.get(report._id.toString());
      if (ws) {
        ws.send(report.status);
      }
    });
  }
}

function startSocketServer(server: Server, callback?: () => void) {
  const wss = new WebSocket.Server({ server }, callback);
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
    askStatus(wsMap);
  }, 50);
}

export default startSocketServer;
