// Small presentational helpers for loading / error / empty states

export function Loading({ text = 'جارٍ التحميل...' }) {
  return (
    <div className="status" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="empty">{children}</div>;
}
