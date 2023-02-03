import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Peer from 'peerjs';
import './App.css';
import showToast from './utils/showToast';

const { electron } = window;

const IPC = electron.ipcRenderer;
let InputValue = '';

const Hello = () => {
  const [localIP, setLocalIP] = useState('');
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        },
      } as any)
      .then((stream: MediaStream) => {
        stream.removeTrack(stream.getVideoTracks()[0]);
        streamRef.current = stream;
        return true;
      })
      .catch((e) => {
        console.error('getSources Error:', e);
        showToast({ title: `getSources Error: ${e}` });
      });
  }, []);

  const connect = useCallback(
    (host: string) => {
      if (!host) return undefined;
      const peer = new Peer(`${localIP.replace(/\./g, '-')}`, {
        host,
        port: 5145,
        path: '/',
      });
      return peer;
    },
    [localIP]
  );

  useEffect(() => {
    const peer = connect(localIP);
    if (!peer) {
      showToast({ title: `出现错误： 连接 本地 peer 失败` });
    }
  }, [connect, localIP]);

  const startConnect = useCallback(
    (targetIP: string) => {
      const peer = connect(targetIP);
      if (!peer) {
        showToast({ title: `出现错误： peer 获取失败` });
        return;
      }
      peer.on('connection', (conn) => {
        showToast({ title: '连接成功' });
        conn.on('data', (data) => {
          showToast({ title: `获取到内容, ${data}` });
        });
      });
      peer.on('call', (call) => {
        call.answer(undefined);
        call.on('stream', (stream) => {
          showToast({ title: '接收到stream' });
          const audio = document.querySelector('audio');
          if (!audio) return;
          audio.srcObject = stream;
          audio.onloadedmetadata = () => audio.play();
        });
      });
      peer.on('error', (err) => {
        showToast({ title: `出现错误：${err}` });
      });
      if (!streamRef.current) {
        showToast({ title: `出现错误： streamRef.current 为空` });
        return;
      }
      peer?.call(targetIP.replace(/\./g, '-'), streamRef.current);
    },
    [connect]
  );

  useEffect(() => {
    IPC.once('getIP', (LocalIP) => {
      console.log(LocalIP);
      setLocalIP(LocalIP as string);
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
            InputValue = target.value;
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
            showToast({ title: '开始建立连接' });
            // connect(InputValue);
            startConnect(InputValue);
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
