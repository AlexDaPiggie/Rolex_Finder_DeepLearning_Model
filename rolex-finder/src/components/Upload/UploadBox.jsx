import "./UploadBox.css";
import { useRef, useState } from "react";
import WatchIcon from "../UI/WatchIcon";

function UploadBox() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const inputRef = useRef(null);

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
    setFileName(file.name);
  }

  function removeImage() {
    setImage(null);
    setFileName("");

    // Allows selecting the same image again
    inputRef.current.value = "";
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
        disabled={!image}
      >
        FIND
      </button>
    </div>
  );
}

export default UploadBox;