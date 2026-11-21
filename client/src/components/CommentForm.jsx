import { useState } from 'react';
import { getErrorMessage, photoAPI } from '../utils/api';

// Posts a comment and hands the saved comment to the parent, so the UI updates without a reload
function CommentForm({ photoId, onAdded }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await photoAPI.addComment(photoId, text);
      onAdded(res.data.data);
      setText('');
    } catch (err) {
      setError(getErrorMessage(err, 'تعذرت إضافة التعليق.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card comment-form-card">
      <h3>أضف تعليقك وقصتك المرتبطة بالصورة</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="comment-form">
        <label htmlFor="comment" className="sr-only">تعليقك</label>
        <textarea
          id="comment"
          className="form-control"
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب تعليقك هنا..."
          rows="3"
          maxLength="1000"
          required
        />
        <button type="submit" className="btn btn-amber" disabled={submitting || !text.trim()}>
          {submitting ? 'جارٍ الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;
