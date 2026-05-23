const MetricCard = ({ label, value, color, subtext }) => (
  <div className="sr-card">
    <div className="sr-card__value" style={color ? { color } : undefined}>
      {value ?? "—"}
    </div>
    <div className="sr-card__label">{label}</div>
    {subtext && <div className="sr-card__subtext">{subtext}</div>}
  </div>
);

export default MetricCard;
