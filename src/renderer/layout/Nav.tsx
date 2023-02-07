import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import './Nav.css';

const { electron } = window;
const IPC = electron.ipcRenderer;

export default function Nav() {
  const hideWindow = useCallback(() => {
    IPC.sendMessage('winHide', []);
  }, []);
  return (
    <>
      <nav className="nav">
        {/* menu and control bar */}
        <button
          type="button"
          onClick={() => {
            hideWindow();
          }}
        >
          x
        </button>
      </nav>
      <div style={{ flex: '1 1 auto' }}>
        <Outlet />
      </div>
    </>
  );
}
