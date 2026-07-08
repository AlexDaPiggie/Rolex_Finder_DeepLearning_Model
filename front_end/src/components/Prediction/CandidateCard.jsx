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

        {references.map((ref, index) => (
          <a
            key={`${ref}-${index}`}
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${model} ${ref}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search Google for ${model} ${ref}`}
          >
            {ref}
          </a>
        ))}

      </div>

    </div>
  );
}

export default CandidateCard;
