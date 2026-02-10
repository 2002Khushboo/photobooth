# 📸 React Photobooth App

A web-based photobooth application built using **React + Vite** that:
- Accesses the user’s camera
- Captures photos with a countdown
- Automatically creates a vertical photo strip
- Allows downloading the final strip as an image

---

## 🚀 Features

- Live camera preview (front camera)
- Countdown before each capture
- Automatic multi-photo session (4 photos)
- Mirrored capture for natural selfies
- Final photo strip generation
- Downloadable photostrip image

---

## 🛠 Tech Stack

- React (Hooks)
- Vite
- HTML5 Canvas
- Web Media APIs (`getUserMedia`)

---

## 📂 Project Structure

src/
├── components/
│ └── CameraPreview.jsx
├── styles/
│ └── booth.css
└── App.jsx


---

## ▶️ How to Run Locally

```bash
npm install
npm run dev
Then open the URL shown in the terminal.

⚠️ Permissions
This app requires camera access.
Please allow camera permissions when prompted by the browser.

🧠 Learnings & Debugging Notes
Detailed learnings and debugging journey are documented here:

docs/LEARNINGS.md

docs/BUGS_AND_FIXES.md

✨ Future Improvements
Retake photo option

Camera shutter animation & sound

Mobile Safari optimizations

Custom photo strip layouts