import "./ProbabilityTable.css";

function ProbabilityTable({ probabilities }) {
  return (
    <section className="probability-table">

      <h2>
        Model Probabilities
      </h2>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Model</th>
              <th>Probability</th>
            </tr>

          </thead>

          <tbody>

            {probabilities.map((item) => (

              <tr key={item.name}>

                <td>{item.name}</td>

                <td>{item.value}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default ProbabilityTable;