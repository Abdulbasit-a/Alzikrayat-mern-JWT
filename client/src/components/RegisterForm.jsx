import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/api';

const EMPTY = { firstName: '', lastName: '', email: '', password: '' };

function RegisterForm({ onRegistered }) {
  const { register } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      onRegistered(); // back to the login view
    } catch (err) {
      setError(getErrorMessage(err, 'تعذر إنشاء الحساب.'));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="first-name" className="form-label">الاسم الأول</label>
          <input id="first-name" name="firstName" className="form-control" dir="auto" value={form.firstName}
            onChange={handleChange} autoComplete="given-name" maxLength="50" required />
        </div>
        <div className="form-group">
          <label htmlFor="last-name" className="form-label">الاسم الأخير</label>
          <input id="last-name" name="lastName" className="form-control" dir="auto" value={form.lastName}
            onChange={handleChange} autoComplete="family-name" maxLength="50" required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
        <input id="email" name="email" type="email" className="form-control" dir="ltr" placeholder="example@mail.com"
          value={form.email} onChange={handleChange} autoComplete="email" inputMode="email" required />
      </div>

      <div className="form-group form-group-lg">
        <label htmlFor="password" className="form-label">كلمة المرور</label>
        <input id="password" name="password" type="password" className="form-control" placeholder="••••••••••••"
          value={form.password} onChange={handleChange} autoComplete="new-password" minLength="8" maxLength="72" required />
        <div className="form-text">يجب أن تكون كلمة المرور 8 أحرف على الأقل.</div>
      </div>

      <button type="submit" className="btn btn-amber btn-block btn-lg-y" disabled={submitting}>
        {submitting ? 'جارٍ التسجيل...' : 'تسجيل'}
      </button>
    </form>
  );
}

export default RegisterForm;
