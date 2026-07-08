import "./Summary.css";

function Summary({ summary }) {
  return (
    <section className="summary">

      <h2>Prediction Summary</h2>

      <p>
        Among known variants, the closest match is{" "}
        <strong>{summary.bestMatch}</strong>, with possible{" "}
        <strong>
          reference IDs {summary.bestReferences.join(", ")}
        </strong>
        . The next closest match is{" "}
        <strong>{summary.secondMatch}</strong>, with possible{" "}
        <strong>
          reference IDs {summary.secondReferences.join(", ")}
        </strong>
        .
      </p>

    </section>
  );
}

export default Summary;