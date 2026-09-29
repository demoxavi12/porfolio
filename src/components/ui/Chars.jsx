/**
 * Splits text into individually animatable characters.
 * The characters are aria-hidden — the parent must carry the accessible text.
 */
export default function Chars({ text, step = 0.035, delay = 0, className = "" }) {
  return (
    <span className={`chars ${className}`} aria-hidden="true">
      {Array.from(text).map((char, i) => (
        <span className="chars__c" key={i} style={{ "--d": `${(delay + i * step).toFixed(3)}s` }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
