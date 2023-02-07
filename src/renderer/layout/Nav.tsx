import { Outlet } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  return (
    <>
      <nav className="nav">
        {/* menu and control bar */}
        <div>x</div>
      </nav>
      <div style={{ flex: '1 1 auto' }}>
        <Outlet />
      </div>
    </>
  );
}
