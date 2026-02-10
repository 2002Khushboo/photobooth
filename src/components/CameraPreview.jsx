import { useEffect, forwardRef } from "react";

const CameraPreview = forwardRef((props, videoRef) => {

  useEffect(() => {
    let stream;

    async function startCamera() {
      console.log("[CameraPreview] Requesting camera access...");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        console.log("[CameraPreview] Camera stream received");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          console.log(
            "[CameraPreview] Video playing:",
            "width =", videoRef.current.videoWidth,
            "height =", videoRef.current.videoHeight
          );
        }
      } catch (err) {
        console.error("[CameraPreview] Camera access failed:", err);
      }
    }

    startCamera();

    return () => {
      console.log("[CameraPreview] Cleaning up camera");
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
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
