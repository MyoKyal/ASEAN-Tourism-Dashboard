import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="app-shell app-shell--dark">
      <header className="topnav">
        <NavLink to="/" className="brand">
          ASEAN Tourism
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Map
          </NavLink>
          <NavLink to="/compare">Compare</NavLink>
          <NavLink to="/overview">Stats</NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
