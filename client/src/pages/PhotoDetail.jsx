import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, imageUrl, photoAPI } from '../utils/api';
import { formatDateTime } from '../utils/format';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { ErrorMessage, Loading } from '../components/StatusMessage';

function PhotoDetail() {
  const { id } = useParams(); // route: /photos/:id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([photoAPI.getOne(id), photoAPI.getComments(id)])
      .then(([photoRes, commentsRes]) => {
        setPhoto(photoRes.data.data);
        setComments(commentsRes.data.data);
      })
      .catch((err) => {
        const notFound = [400, 404].includes(err.response?.status);
        setError(notFound ? 'هذه الذكرى غير موجودة (ربما تم حذفها).' : getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  const handleDeletePhoto = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الذكرى؟ سيتم حذف الصورة نهائياً.')) return;
    setDeleting(true);
    setActionError('');
    try {
      await photoAPI.remove(id);
      navigate('/gallery');
    } catch (err) {
      setActionError(getErrorMessage(err, 'تعذر حذف الذكرى.'));
      setDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('هل أنت متأكد من حذف التعليق؟')) return;
    setActionError('');
    try {
      await photoAPI.removeComment(id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      setActionError(getErrorMessage(err, 'تعذر حذف التعليق.'));
    }
  };

  if (loading) return <main className="container main"><Loading text="جارٍ تحميل الذكرى..." /></main>;
  if (error) {
    return (
      <main className="container main">
        <ErrorMessage message={error} onRetry={load} />
        <Link to="/gallery" className="link">→ العودة إلى المعرض</Link>
      </main>
    );
  }

  const isOwner = user && photo.userId?._id === user._id;
  const author = photo.userId ? `${photo.userId.firstName} ${photo.userId.lastName}` : 'مستخدم محذوف';

  return (
    <main className="container main">
      <div className="photo-container">
        <img src={imageUrl(photo.fileName)} alt={photo.title} />
      </div>

      {actionError && <div className="alert alert-danger" role="alert">{actionError}</div>}

      <div className="detail-grid">
        <section className="detail-comments">
          <h2 className="heading-serif">التعليقات والمشاركات</h2>

          <CommentList comments={comments} currentUserId={user?._id} onDelete={handleDeleteComment} />

          {user ? (
            <CommentForm photoId={id} onAdded={(c) => setComments((prev) => [...prev, c])} />
          ) : (
            <div className="alert alert-light">
              يجب <Link to="/login" state={{ from: `/photos/${id}` }} className="link-strong">تسجيل الدخول</Link> لإضافة تعليق.
            </div>
          )}
        </section>

        <aside className="detail-story">
          <div className="story-card">
            <div className="story-author">
              <div>
                <h3 dir="auto">{author}</h3>
                <small className="text-secondary">تاريخ النشر: {formatDateTime(photo.dateTime)}</small>
              </div>
              <div className="avatar" aria-hidden="true">👤</div>
            </div>
            <hr />
            <h1 className="heading-serif story-title" dir="auto">{photo.title}</h1>
            <p className="text-secondary story-desc" dir="auto">
              {photo.description || 'لا يوجد وصف لهذه الذكرى.'}
            </p>

            {isOwner && (
              <>
                <hr className="spaced" />
                <button className="btn btn-outline-danger btn-block" onClick={handleDeletePhoto} disabled={deleting}>
                  {deleting ? 'جارٍ الحذف...' : 'حذف الذكرى'}
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PhotoDetail;
