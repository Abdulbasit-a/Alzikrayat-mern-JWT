import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/api';

function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'تعذر تسجيل الدخول.'));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="form-group">
        <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
        <input id="email" type="email" className="form-control" dir="ltr" placeholder="example@mail.com"
          value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" required />
      </div>

      <div className="form-group form-group-lg">
        <label htmlFor="password" className="form-label">كلمة المرور</label>
        <input id="password" type="password" className="form-control" placeholder="••••••••••••"
          value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      </div>

      <button type="submit" className="btn btn-amber btn-block btn-lg-y" disabled={submitting}>
        {submitting ? 'جارٍ الدخول...' : 'دخول'}
      </button>
    </form>
  );
}

export default LoginForm;
