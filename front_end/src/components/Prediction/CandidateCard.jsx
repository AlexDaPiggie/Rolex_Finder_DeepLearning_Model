import "./CandidateCard.css";

function CandidateCard({
  rank,
  model,
  score,
  references
}) {
  return (
    <div className="candidate-card">

      <div className="candidate-number">
        {rank}
      </div>

      <h3>
        {model}
      </h3>

      <div className="score-section">

    <p>
        Match Score: <strong>{score.toFixed(2)}%</strong>
    </p>

</div>

      <div className="references">

        {references.map((ref) => (
          <span key={ref}>
            {ref}
          </span>
        ))}

      </div>

    </div>
  );
}

export default CandidateCard;
