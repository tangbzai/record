import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import './Nav.css';

const { electron } = window;

export default function Nav() {
  const hideWindow = useCallback(() => {
    const IPC = electron.ipcRenderer;
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
