import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhotoCard from './PhotoCard';
import { EmptyState } from './StatusMessage';
import { useAuth } from '../context/AuthContext';

// Display styles: list, 4 columns, 3 columns (same three buttons as the original design)
const VIEWS = [
  {
    id: 'list',
    title: 'عرض قائمة',
    icon: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
  },
  {
    id: 'cols4',
    title: '٤ أعمدة',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    id: 'cols3',
    title: '٣ أعمدة',
    icon: (
      <>
        <rect x="3" y="3" width="5" height="18" /><rect x="10.5" y="3" width="5" height="18" /><rect x="18" y="3" width="5" height="18" />
      </>
    ),
  },
];
const VIEW_KEY = 'alzikrayat_gallery_view';

const readView = () => {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    return VIEWS.some((v) => v.id === saved) ? saved : 'cols3';
  } catch {
    return 'cols3';
  }
};

function PhotoGallery({ photos, title, showToggle = true, action }) {
  const { user } = useAuth();
  const [view, setView] = useState(readView);

  const changeView = (id) => {
    setView(id);
    try {
      localStorage.setItem(VIEW_KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <section>
      <div className="section-head">
        <div className="section-title">
          <span className="section-bar" />
          <h2>{title}</h2>
        </div>

        <div className="section-tools">
          {action}
          {showToggle && (
            <div className="view-buttons" role="group" aria-label="تغيير طريقة العرض">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`view-btn${view === v.id ? ' active' : ''}`}
                  title={v.title}
                  aria-label={v.title}
                  aria-pressed={view === v.id}
                  onClick={() => changeView(v.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {v.icon}
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {photos.length === 0 ? (
        <EmptyState>
          <p>لا توجد صور منشورة حتى الآن. كن أول من يشارك ذكرياته!</p>
          <Link to={user ? '/upload' : '/login'} className="btn btn-amber">رفع صورة الآن</Link>
        </EmptyState>
      ) : (
        <div className={`gallery gallery-${showToggle ? view : 'cols3'}`}>
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PhotoGallery;
