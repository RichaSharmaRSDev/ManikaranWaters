const MetricCard = ({ label, value, color, subtext, icon }) => (
  <div className="sr-card">
    <div className="sr-card__value" style={color ? { color } : undefined}>
      {value ?? "—"}
    </div>
    <div className="sr-card__label">
      {icon && <span className="sr-card__icon">{icon}</span>}
      <span className="sr-card__label-text">{label}</span>
    </div>
    {subtext && <div className="sr-card__subtext">{subtext}</div>}
  </div>
);

export default MetricCard;
