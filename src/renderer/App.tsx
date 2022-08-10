import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Peer from 'peerjs';
import './App.css';
import showToast from './utils/showToast';

const { electron } = window;

function connect(LocalIP: string) {
  const peer = new Peer(`${LocalIP.replace(/\./g, '-')}`, {
    host: LocalIP,
    port: 19527,
    debug: 3,
  });
  peer.on('connection', (conn) => {
    console.log('连接成功');
    conn.on('data', (data) => {
      console.log('获取到内容', data);
    });
  });
  peer.on('call', (call) => {
    call.answer(undefined);
    call.on('stream', (stream) => {
      console.log('接收到stream');
      const audio = document.querySelector('audio');
      if (!audio) return;
      audio.srcObject = stream;
      audio.onloadedmetadata = () => audio.play();
    });
  });
  peer.on('error', (err) => {
    console.error('出现错误：', err);
    console.log(peer);
    // setTimeout(() => {
    //   if (!document.getElementById("isServer").checked)
    //     connect(getLocalIP());
    //   else startConnect();
    // }, 500);
  });
  return peer;
}
const IPC = electron.ipcRenderer;
let targetIP = '';
const Hello = () => {
  const [localIP, setLocalIP] = useState<string>('');
  useEffect(() => {
    IPC.once('getIP', (LocalIP) => {
      setLocalIP(LocalIP as string);
      connect(LocalIP as string);
    });
    IPC.sendMessage('getIP', []);
  }, []);
  return (
    <div className="app">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio />
      <div className="Hello">
        <span>IP&nbsp;:&nbsp;{localIP}</span>
        <button
          className="copy"
          type="button"
          onClick={() => {
            electron.clipboard.writeText(localIP);
            showToast({ title: '复制成功!' });
          }}
        >
          复制
        </button>
      </div>
      <div className="Hello">
        <input
          placeholder="目标IP"
          onChange={({ target }) => {
            targetIP = target.value;
          }}
        />
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          刷新
        </button>
        <button
          type="button"
          onClick={() => {
            connect(targetIP);
          }}
        >
          建立连接
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
