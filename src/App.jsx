import { useState, useRef } from "react";
import "./styles/booth.css";
import CameraPreview from "./components/CameraPreview";

function App() {
  const TOTAL_PHOTOS =4;
  const COUNTDOWN_START =3;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(COUNTDOWN_START);
  
  const [photos, setPhotos] = useState([]);
  const [currentShot, setCurrentShot] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [photoStrip, setPhotoStrip] = useState(null);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // mirror fix
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setPhotos((prev) => [...prev, imageData]);
    //setPhoto(imageData);
  };

  const createPhotoStrip = async (images) => {
    const imgElements = await Promise.all(
      images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        });
      })
    );

    const width = imgElements[0].width;
    const height = imgElements[0].height;

    const padding = 30;
    const footerHeight = 80;

    const canvas = document.createElement("canvas");
    canvas.width = width + padding * 2;
    canvas.height =
      imgElements.length * height + padding * 2 + footerHeight;

    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw photos
    imgElements.forEach((img, index) => {
      ctx.drawImage(
        img,
        padding,
        padding + index * height,
        width,
        height
      );
    });

    // Footer text
    ctx.fillStyle = "#000";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";

    const date = new Date().toLocaleDateString();
    ctx.fillText(
      `Photobooth • ${date}`,
      canvas.width / 2,
      canvas.height - 30
    );

    const stripImage = canvas.toDataURL("image/png");
    setPhotoStrip(stripImage);
  };

  const startSession = () => {
    setPhotos([]);
    setCurrentShot(0);
    setIsSessionActive(true);
    startCountdown();
  };

  const startCountdown = () => {
    setIsCounting(true);
    setCount(COUNTDOWN_START);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsCounting(false);
          handleCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCapture = () => {
    capturePhoto();

    if (currentShot + 1 < TOTAL_PHOTOS) {
      setTimeout(() => {
        setCurrentShot((prev) => prev + 1);
        startCountdown();
      }, 800); // small breathing gap
    } else {
      setIsSessionActive(false);

      setTimeout(() => {
        createPhotoStrip(photos.concat());
      },300);
    }
  };

  return (
    <div className="booth">
      <div className="camera-area">
        <CameraPreview ref={videoRef} />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/*<div className="overlay">
          {!isCounting && !photo && (
            <div className="look-here">LOOK HERE 👀</div>
          )}
          {isCounting && <div className="countdown">{count}</div>}
        </div>

        {!isCounting && !photo && (
          <button className="start-btn" onClick={startCountdown}>
            START
          </button>
        )}*/}

        <div className="overlay">
          {isCounting && <div className="countdown">{count}</div>}

          {!isCounting && isSessionActive && (
            <div className="shot-indicator">
              {currentShot + 1} / {TOTAL_PHOTOS}
            </div>
          )}

          {!isSessionActive && photos.length === 0 && (
            <div className="look-here">LOOK HERE 👀</div>
          )}
        </div>

        {!isSessionActive && photos.length === 0 && (
          <button className="start-btn" onClick={startSession}>
            START
          </button>
        )}

        {/*{photos && (
          <div className="preview">
            <img src={photos} alt="Captured" />
          </div>
        )}*/}
      </div>
      {photoStrip && (
        <div className="strip-preview">
          <img src={photoStrip} alt="Photo Strip" />

          <a
            href={photoStrip}
            download="photostrip.png"
            className="download-btn"
          >
            DOWNLOAD
          </a>
        </div>
        )}
    </div>
  );
}

export default App;
