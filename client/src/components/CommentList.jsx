import { formatDateTime } from '../utils/format';

// Comments of a photo. The delete button is shown only on the current user's own comments.
function CommentList({ comments, currentUserId, onDelete }) {
  if (comments.length === 0) {
    return (
      <div className="card card-plain">
        <p className="text-secondary center">لا توجد تعليقات حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((c) => (
        <article key={c._id} className="comment-card">
          <div className="comment-head">
            <strong dir="auto">{c.userId ? `${c.userId.firstName} ${c.userId.lastName}` : 'مستخدم محذوف'}</strong>
            <small className="text-secondary">{formatDateTime(c.dateTime)}</small>
          </div>
          <p dir="auto">{c.comment}</p>
          {currentUserId && c.userId?._id === currentUserId && (
            <div className="comment-actions">
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete(c._id)}>
                حذف
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default CommentList;
