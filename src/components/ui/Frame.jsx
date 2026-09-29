/** A minimal browser window. Sizes inside scale with the frame (container queries). */
export default function Frame({ url, tag = "live", className = "", children }) {
  return (
    <div className={`frame ${className}`}>
      <div className="frame__bar" aria-hidden="true">
        <span className="frame__glyph" />
        <span className="frame__url">{url}</span>
        <span className="frame__tag">{tag}</span>
      </div>
      <div className="frame__body" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
