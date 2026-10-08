export default function Loading() {
  return <main className="route-loading" aria-live="polite">
    <div className="route-loading-inner">
      <span className="route-loading-mark" aria-hidden="true" />
      <p>Opening your journal…</p>
      <span className="route-loading-track" aria-hidden="true"><span /></span>
    </div>
  </main>;
}
