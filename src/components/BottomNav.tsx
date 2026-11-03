import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
  const { pathname } = useLocation();
  const feedActive = pathname.startsWith('/feed');
  const tileActive = pathname.startsWith('/tile') || pathname.startsWith('/service');

  return (
    <Nav className="bottom-nav" aria-label="Основная навигация">
      <Nav.Link as={Link} to="/feed" active={feedActive} className="bottom-nav__item">
        <span className="nav-symbol" aria-hidden="true">▤</span>
        <span>Лента</span>
      </Nav.Link>
      <Nav.Link disabled className="bottom-nav__item" title="Добавление доступно в следующих лабораторных работах">
        <span className="nav-symbol" aria-hidden="true">＋</span>
        <span>Добавление</span>
      </Nav.Link>
      <Nav.Link as={Link} to="/tile" active={tileActive} className="bottom-nav__item">
        <span className="nav-symbol" aria-hidden="true">▦</span>
        <span>Плитка</span>
      </Nav.Link>
      <Nav.Link disabled className="bottom-nav__item" title="Вход не реализован для гостевого режима">
        <span className="nav-symbol" aria-hidden="true">↪</span>
        <span>Вход</span>
      </Nav.Link>
    </Nav>
  );
}
