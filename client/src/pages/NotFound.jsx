import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="container main">
      <div className="empty">
        <h1 className="heading-serif">الصفحة غير موجودة</h1>
        <p className="text-secondary">الصفحة التي تبحث عنها غير موجودة.</p>
        <Link to="/" className="btn btn-amber">العودة إلى الرئيسية</Link>
      </div>
    </main>
  );
}

export default NotFound;
