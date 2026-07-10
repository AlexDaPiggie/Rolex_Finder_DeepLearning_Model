import "./TutorialPanel.css";

const tutorialSteps = [
  {
    title: "Paste Image",
    gif: "/tutorial/paste-image.gif",
    steps: [
      "Copy the Rolex image.",
      "Press Ctrl + V to paste it into Rolex Finder.",
      'Click "Find" and wait a few seconds.',
    ],
  },
  {
    title: "Browse Image",
    gif: "/tutorial/browse-image.gif",
    steps: [
      'Click the yellow "Browse File" button.',
      "Choose an image from your desktop.",
      'Click "Find" and wait a few seconds.',
    ],
  },
  {
    title: "Search Image",
    gif: "/tutorial/search-image.gif",
    steps: [
      "After the result appears, click any watch ID.",
      "Use the images to compare references.",
    ],
  },
];

const helperNotes = [
  {
    title: "Best results",
    text: "Use a clear, front-facing watch photo with the dial, bezel, and bracelet visible.",
  },
  {
    title: "Accuracy note",
    text: "Predictions are closest-match estimates, not guaranteed Rolex reference identifications.",
  },
  {
    title: "If it looks wrong",
    text: "Try a clearer image, then compare the variant IDs with Google Images for visual confirmation.",
  },
];

function TutorialPanel() {
  return (
    <div className="tutorial-panel">
      <div className="tutorial-intro">
        <p className="eyebrow">Quick start</p>
        <h2>Find the closest Rolex model in seconds.</h2>
        <p>
          Drop a watch photo. Let the crown tell its story.
        </p>
      </div>

      <div className="tutorial-grid">
        {tutorialSteps.map((item, index) => (
          <article className="tutorial-card" key={item.title}>
            <div className="tutorial-heading">
              <span>{index + 1}</span>
              <h3>{item.title}</h3>
            </div>

            <img src={item.gif} alt={`${item.title} tutorial`} />

            <ol>
              {item.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      <div className="tutorial-notes" aria-label="Tips for better Rolex Finder results">
        {helperNotes.map((note) => (
          <article className="tutorial-note" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.text}</p>
          </article>
        ))}
      </div>

      <p className="credits">
        <a
          href="https://github.com/AlexDaPiggie/Rolex_Models_Recognition"
          target="_blank"
          rel="noopener noreferrer"
        >
          About this project
        </a>
      </p>
    </div>
  );
}

export default TutorialPanel;
