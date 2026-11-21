import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

// One view for both flows: /login shows the login form, /register shows the registration form
function LoginRegister({ mode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  // Already logged in: nothing to do here
  if (user) return <Navigate to={redirectTo} replace />;

  if (mode === 'register') {
    return (
      <main className="auth-page">
        <section className="auth-card auth-card-register">
          <header className="auth-header">
            <h1>إنشاء حساب جديد</h1>
            <p>انضم إلينا وابدأ بتدوين لحظاتك ومشاركتها</p>
          </header>

          <RegisterForm onRegistered={() => navigate('/login', { state: { registered: true, from: redirectTo } })} />

          <p className="auth-switch">
            لديك حساب بالفعل؟ <Link to="/login" className="link-strong">سجل دخولك من هنا</Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-login" aria-labelledby="login-heading">
        <header className="auth-header">
          <h1 id="login-heading">مرحباً بك مجدداً</h1>
          <p>سجل دخولك لتستعرض وتشارك ذكرياتك الجميلة</p>
        </header>

        {location.state?.registered && (
          <div className="alert alert-success" role="status">تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.</div>
        )}

        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />

        <p className="auth-switch">
          ليس لديك حساب؟ <Link to="/register" className="link-strong">أنشئ حساباً جديداً الآن</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginRegister;
