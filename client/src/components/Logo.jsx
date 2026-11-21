import { Link } from 'react-router-dom';

// Brand mark: the gradient badge with the logo image + the "الذكريات" wordmark
function Logo() {
  return (
    <Link to="/" className="brand" aria-label="الذكريات، الصفحة الرئيسية">
      <span className="brand-badge">
        <img src="/vector.svg" alt="" />
      </span>
      <span className="brand-name">الذكريات</span>
    </Link>
  );
}

export default Logo;
