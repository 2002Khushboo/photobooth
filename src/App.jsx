import { useState, useEffect, useRef } from "react";
import "./styles/booth.css";
import CameraPreview from "./components/CameraPreview";

function App() {
  const TOTAL_PHOTOS =4;
  const COUNTDOWN_START =3;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);

  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(COUNTDOWN_START);
  const [photos, setPhotos] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [photoStrip, setPhotoStrip] = useState(null);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0) {
      console.warn("[Capture] Video not ready");
      return null;
    }

    console.log(
      "[Capture] Capturing frame at time:",
      video.currentTime.toFixed(2)
    );

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // mirror fix
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    
    return imageData; 
  };

  const startCountdown = () => {
    if (countdownRef.current) {
      console.log("[Countdown] Already running, skipping");
      return;
    }

    console.log("[Countdown] Starting");
    setIsCounting(true);
    setCount(COUNTDOWN_START);

    countdownRef.current = setInterval(() => {
      setCount(prev => {
        console.log("[Countdown] Tick:", prev);

        if (prev === 1) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;

          setIsCounting(false);
          handleCapture();
          
          return COUNTDOWN_START; // reset value safely
        }

        return prev - 1;
      });
    }, 1000);
  };

  const handleCapture = () => {
    setPhotos(prev => {
      if (prev.length >= TOTAL_PHOTOS) {
        console.log("[Capture] Max photos reached");
        return prev;
      }

      const imageData = capturePhoto();
      if (!imageData) return prev;
      console.log(
        `[Capture] Photo ${prev.length + 1} captured`
      );
      return [...prev, imageData];
    });
  };

  useEffect(() => {
    if (!isSessionActive) return;
    console.log(
      `[Flow] photos.length = ${photos.length}`
    );
    if (photos.length < TOTAL_PHOTOS) {
        startCountdown();
    } 
    else 
    {
      console.log("[Flow] Session complete");
      setIsSessionActive(false);
      setTimeout(() => {
        createPhotoStrip(photos);
      }, 300);
    }
  }, [photos.length, isSessionActive]);

  const createPhotoStrip = async (images) => {
    console.log("[Strip] Creating photo strip");
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
    console.log("[Strip] Photo strip ready");
  };

  const startSession = () => {
    console.log("[Session] Starting new session");
    setPhotos([]);
    setPhotoStrip(null);
    setIsSessionActive(true);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return (
    <div className="booth">
      <div className="camera-area">
        <CameraPreview ref={videoRef} />

        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className="overlay">
          {isCounting && <div className="countdown">{count}</div>}

          {!isCounting && isSessionActive && (
            <div className="shot-indicator">
              {photos.length} / {TOTAL_PHOTOS}
            </div>
          )}

          {!isSessionActive && photos.length === 0 && (
            <div className="look-here">LOOK HERE 👀</div>
          )}
        </div>

        {!isSessionActive /*&& photos.length === 0 */ && (
          <button className="start-btn" onClick={startSession}>
            START
          </button>
        )}
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
