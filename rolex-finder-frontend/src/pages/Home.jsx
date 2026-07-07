import "./Home.css";
import { useState } from "react";
import UploadBox from "../components/Upload/UploadBox.jsx";
import PredictionPanel from "../components/Prediction/PredictionPanel.jsx";

function Home() {
  const [prediction, setPrediction] = useState(null);

  return (
    <main className="home">

      <aside className="upload-panel">

        <UploadBox onPrediction={setPrediction} />

      </aside>

      <section className="prediction-panel">
        {prediction && <PredictionPanel prediction={prediction} />}
      </section>

    </main>
  );
}

export default Home;
