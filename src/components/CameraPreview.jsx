import { useEffect, useRef, forwardRef } from "react";

const CameraPreview = forwardRef((props, ref) => {
  const videoRef = ref || useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // front camera
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }

    startCamera();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="camera-video"
    />
  );
});

export default CameraPreview;
