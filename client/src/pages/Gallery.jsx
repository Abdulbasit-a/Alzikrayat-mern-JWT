import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, photoAPI } from '../utils/api';
import PhotoGallery from '../components/PhotoGallery';
import { ErrorMessage, Loading } from '../components/StatusMessage';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    photoAPI
      .getAll()
      .then((res) => setPhotos(res.data.data))
      .catch((err) => setError(getErrorMessage(err, 'تعذر تحميل المعرض.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return (
    <main className="container main">
      {loading ? (
        <Loading text="جارٍ تحميل المعرض..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : (
        <PhotoGallery title="معرض الذكريات المشتركة" photos={photos} />
      )}
    </main>
  );
}

export default Gallery;
