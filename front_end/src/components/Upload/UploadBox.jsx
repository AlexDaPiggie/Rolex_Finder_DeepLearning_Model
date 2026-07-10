import "./UploadBox.css";
import { useCallback, useEffect, useRef, useState } from "react";
import WatchIcon from "../UI/WatchIcon";

const PREDICT_URL = "https://alexdapiggie--rolex-watch-recognizer-rolexwatchapi-web.modal.run/predict";

function UploadBox({ onPrediction }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const inputRef = useRef(null);
  const scanIdRef = useRef(0);

  const selectImage = useCallback((selectedFile) => {
    setImage((currentImage) => {
      if (currentImage) URL.revokeObjectURL(currentImage);
      return URL.createObjectURL(selectedFile);
    });
    setFile(selectedFile);
    setFileName(selectedFile.name || "Pasted image");
    scanIdRef.current += 1;
    setIsScanning(false);
    onPrediction(null);
  }, [onPrediction]);

  useEffect(() => {
    function handlePaste(event) {
      const pastedImage = Array.from(event.clipboardData?.items ?? [])
        .find((item) => item.type.startsWith("image/"))
        ?.getAsFile();

      if (!pastedImage) return;

      event.preventDefault();
      selectImage(pastedImage);
    }

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [selectImage]);

  function handleImage(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) selectImage(selectedFile);
  }

  function removeImage() {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setFile(null);
    setFileName("");
    scanIdRef.current += 1;
    setIsScanning(false);
    onPrediction(null);

    // Allows selecting the same image again
    inputRef.current.value = "";
  }

  async function findWatch() {
    if (!file || isScanning) return;

    const scanId = ++scanIdRef.current;
    setIsScanning(true);
    onPrediction(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("The image could not be scanned");

      const result = await response.json();
      if (scanId !== scanIdRef.current) return;
      if (!result?.predicted_class || !result?.probabilities) {
        throw new Error("The scan returned no prediction");
      }

      onPrediction(result);
    } catch {
      // A failed scan intentionally leaves the prediction area blank.
      if (scanId === scanIdRef.current) onPrediction(null);
    } finally {
      if (scanId === scanIdRef.current) setIsScanning(false);
    }
  }

  return (
    <div className="upload-box">
      <h1 className="logo">
    <span>ROLEX</span>
    Finder
</h1>

      <div className="drop-zone">
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="preview-image"
          />
        ) : (
          <>
            <WatchIcon />

            <p>Paste image here</p>

            <span>or</span>

            <button
              type="button"
              className="browse-btn"
              onClick={() => inputRef.current.click()}
            >
              Browse File
            </button>
          </>
        )}
      </div>

      {/* Only show after an image is selected */}
      {image && (
        <>
          <p className="filename">{fileName}</p>

          <div className="image-actions">
            <button
              type="button"
              className="replace-btn"
              onClick={() => inputRef.current.click()}
            >
              Replace
            </button>

            <button
              type="button"
              className="remove-btn"
              onClick={removeImage}
            >
              Remove
            </button>
          </div>
        </>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleImage}
      />

      <button
        className="find-btn"
        disabled={!image || isScanning}
        onClick={findWatch}
      >
        {isScanning ? "SCANNING..." : "FIND"}
      </button>
    </div>
  );
}

export default UploadBox;
