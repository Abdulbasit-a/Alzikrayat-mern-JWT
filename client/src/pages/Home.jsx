import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, photoAPI } from '../utils/api';
import { formatDateTime, formatNumber } from '../utils/format';
import PhotoGallery from '../components/PhotoGallery';
import { ErrorMessage, Loading } from '../components/StatusMessage';

const LATEST_COUNT = 6;

function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, photos: 0, comments: 0 });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([photoAPI.getStats(), photoAPI.getAll({ limit: LATEST_COUNT })])
      .then(([statsRes, photosRes]) => {
        setStats(statsRes.data.data);
        setPhotos(photosRes.data.data);
      })
      .catch((err) => setError(getErrorMessage(err, 'تعذر تحميل أحدث الذكريات.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return (
    <>
      {user?.lastLogin && (
        <div className="last-login">
          <div className="container">
            <span className="last-login-icon">!</span>
            <span>آخر دخول لك للمنصة كان بتاريخ: {formatDateTime(user.lastLogin)}</span>
          </div>
        </div>
      )}

      <main className="container main">
        <section className="hero">
          <h1>شارك ذكرياتك الجميلة مع العالم</h1>
          <p className="lead">
            مساحة اجتماعية دافئة لتوثيق اللحظات التاريخية والصور العائلية والجماليات المستوحاة من عبق الماضي والزمن الجميل.
          </p>
          <div className="hero-badges">
            <span className="pill pill-amber">{formatNumber(stats.photos)} صورة</span>
            <span className="pill">{formatNumber(stats.users)} عضو</span>
            <span className="pill">{formatNumber(stats.comments)} تعليق</span>
          </div>
          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-amber">تصفح المعرض</Link>
            <Link to={user ? '/upload' : '/register'} className="btn btn-outline">
              {user ? 'شارك صورة' : 'ابدأ الآن'}
            </Link>
          </div>
        </section>

        {loading ? (
          <Loading text="جارٍ تحميل أحدث الذكريات..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : (
          <PhotoGallery
            title="أحدث الذكريات"
            photos={photos}
            showToggle={false}
            action={<Link to="/gallery" className="link">عرض الكل</Link>}
          />
        )}
      </main>
    </>
  );
}

export default Home;
