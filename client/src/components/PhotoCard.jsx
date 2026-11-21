import { Link } from 'react-router-dom';
import { imageUrl } from '../utils/api';
import { formatDate } from '../utils/format';

// One photo in the gallery. The parent decides the layout (list / 3 columns / 4 columns).
function PhotoCard({ photo }) {
  const author = photo.userId ? `${photo.userId.firstName} ${photo.userId.lastName}` : 'مستخدم محذوف';

  return (
    <article className="photo-card">
      <Link to={`/photos/${photo._id}`} className="photo-card-media">
        <img src={imageUrl(photo.fileName)} alt={photo.title} loading="lazy" decoding="async" />
      </Link>
      <div className="photo-card-body">
        <h3 dir="auto">{photo.title}</h3>
        <div className="photo-card-meta">
          <span className="text-amber" dir="auto">{author}</span>
          <span className="text-muted">{formatDate(photo.dateTime)}</span>
        </div>
        <Link to={`/photos/${photo._id}`} className="btn btn-outline btn-block photo-card-btn">
          عرض التفاصيل
        </Link>
      </div>
    </article>
  );
}

export default PhotoCard;
