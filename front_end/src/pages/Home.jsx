import "./Home.css";
import UploadBox from "../components/Upload/UploadBox.jsx";
import PredictionPanel from "../components/Prediction/PredictionPanel.jsx";

function Home() {
  return (
    <main className="home">

      <aside className="upload-panel">

        <UploadBox />

      </aside>

      <section className="prediction-panel">
        <PredictionPanel />
      </section>

    </main>
  );
}

export default Home;