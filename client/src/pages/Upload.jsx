import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage, photoAPI } from '../utils/api';
import { formatFileSize } from '../utils/format';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function Upload() {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Create / release the preview URL so it does not leak memory
  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetFile = () => {
    setFile(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  // Validates the chosen image on the client (the server checks again)
  const acceptFile = (selected) => {
    if (!selected) return;
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('نوع الصورة غير مسموح. يسمح فقط بـ JPG و PNG و GIF و WEBP.');
      resetFile();
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError('حجم الصورة يجب ألا يتجاوز 10 ميغابايت.');
      resetFile();
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    try {
      // Put the dropped file into the input so it is part of the form
      const transfer = new DataTransfer();
      transfer.items.add(dropped);
      fileInput.current.files = transfer.files;
    } catch {
      /* older browsers: the file state below is still used for the upload */
    }
    acceptFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('عنوان الصورة مطلوب.');
    if (!file) return setError('يرجى اختيار صورة.');

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const res = await photoAPI.create(formData);
      navigate(`/photos/${res.data.data._id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'تعذر نشر الذكرى.'));
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-upload">
        <header className="auth-header">
          <h1>شارك ذكرى جديدة</h1>
          <p>انشر صور اليوم لتصبح ذكريات الغد</p>
        </header>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group form-group-lg">
            <label
              htmlFor="memory-image"
              className={`dropzone${dragging ? ' dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="dropzone-preview">
                  <img src={preview} alt="معاينة الصورة" />
                  <strong dir="auto">{file.name}</strong>
                  <span className="text-secondary small">{formatFileSize(file.size)}</span>
                  <span className="dropzone-hint">اضغط لاختيار صورة أخرى</span>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <strong>اسحب الصورة وأفلتها هنا</strong>
                  <span className="text-secondary small">
                    أو اضغط لتصفح ملفاتك<br />JPG, PNG, GIF, WEBP حتى ١٠ ميغابايت
                  </span>
                  <span className="btn btn-light btn-sm">تصفح الملفات</span>
                </div>
              )}
              <input
                id="memory-image"
                ref={fileInput}
                type="file"
                name="photo"
                className="sr-only"
                accept={ALLOWED_TYPES.join(',')}
                onChange={(e) => acceptFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="form-group form-group-lg">
            <label htmlFor="memory-title" className="form-label">عنوان الصورة</label>
            <input id="memory-title" className="form-control" dir="auto" value={title} maxLength="200"
              placeholder="مثال: فنجان قهوة الصباح في بيت جدي القديم"
              onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group form-group-lg">
            <label htmlFor="memory-description" className="form-label">وصف الصورة أو قصتها</label>
            <textarea id="memory-description" className="form-control" dir="auto" rows="5" maxLength="1000"
              placeholder="اكتب هنا تفاصيل الذكرى.. من كان معك؟ وأين ومتى تم التقاطها؟"
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-light btn-block btn-lg-y">إلغاء</Link>
            <button type="submit" className="btn btn-amber btn-block btn-lg-y" disabled={submitting}>
              {submitting ? 'جارٍ النشر...' : 'نشر الذكرى'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Upload;
