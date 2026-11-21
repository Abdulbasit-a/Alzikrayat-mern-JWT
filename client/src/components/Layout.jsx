import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <Outlet />
      <footer className="footer">
        <div className="container footer-inner">
          <p>© ٢٠٢٦ منصة الذكريات. جميع الحقوق محفوظة لتوثيق اللحظات الجميلة.</p>
          <div className="footer-links">
            <span>الشروط والأحكام</span>
            <span>سياسة الخصوصية</span>
            <span>تواصل معنا</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
