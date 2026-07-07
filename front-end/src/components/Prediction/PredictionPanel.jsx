import "./PredictionPanel.css";

import Header from "./Header";
import MatchNotice from "./MatchNotice";
import CandidateCards from "./CandidateCards";
import ProbabilityTable from "./ProbabilityTable";
import Summary from "./Summary";

function PredictionPanel() {

  const prediction = {
    model: "Cellini",
    confidence: 99.82,
  };

  const matches = [
    {
      rank: 1,
      model: "Rolex Cellini Danaos",
      score: 28.92,
      references: ["4233", "4233", "4238"],
    },
    {
      rank: 2,
      model: "Rolex Cellini Time",
      score: 21.84,
      references: ["5050", "50505", "50509"],
    },
    {
      rank: 3,
      model: "Rolex Cellini Dual Time",
      score: 16.77,
      references: ["5052", "50525", "50529"],
    },
  ];

  const probabilities = [
    { name: "Cellini", value: "99.8166%" },
    { name: "Daytona", value: "0.0608%" },
    { name: "Date", value: "0.0513%" },
    { name: "Explorer", value: "0.0311%" },
    { name: "GMT Master", value: "0.0194%" },
    { name: "Oyster Perpetual", value: "0.0078%" },
    { name: "Submariner", value: "0.0041%" },
  ];

  const summary = {
  bestMatch: "Rolex Cellini Danaos",
  bestReferences: ["4233", "4243", "6229"],

  secondMatch: "Rolex Cellini Dual Time",
  secondReferences: ["50525", "50529"],
};

  return (
    <div className="prediction-wrapper">

      <Header prediction={prediction} />

      <MatchNotice />

      <CandidateCards matches={matches} />

      <ProbabilityTable probabilities={probabilities} />

      <Summary summary={summary} />

    </div>
  );
}

export default PredictionPanel;