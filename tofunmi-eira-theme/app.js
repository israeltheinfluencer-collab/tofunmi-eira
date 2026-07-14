// DOM Elements
const video = document.getElementById('webcam');
const statusIndicator = document.getElementById('system-status');
const emotionEmoji = document.querySelector('.emotion-display .emoji');
const emotionLabel = document.querySelector('.emotion-display .label');
const intentDisplay = document.querySelector('.intent-text');
const transcriptBox = document.getElementById('transcript-box');
const overlayCanvas = document.getElementById('overlay');

// Use WordPress theme URL for models, fallback to local
const MODEL_URL = (typeof themeData !== 'undefined') ? themeData.modelUrl : './models';

// Load Models
async function loadModels() {
    statusIndicator.innerText = "Loading AI Models...";
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        statusIndicator.innerText = "Starting Camera...";
        startVideo();
    } catch (e) {
        console.error(e);
        statusIndicator.innerText = "Error loading models (Check console).";
    }
}

// Start Camera
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            let videoStream = new MediaStream(stream.getVideoTracks());
            video.srcObject = videoStream;
            statusIndicator.innerText = "System Active";
            startSpeechRecognition();
        })
        .catch(err => {
            console.error(err);
            statusIndicator.innerText = "Camera/Mic Permission Denied";
        });
}

// Facial Emotion Detection Loop
video.addEventListener('play', () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(overlayCanvas, displaySize);

    setInterval(async () => {
        if (video.paused || video.ended) return;
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const topEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            updateEmotionUI(topEmotion);
        }
    }, 500);
});

// Update Emotion UI
const emotionMap = {
    neutral:   { emoji: '😐', label: 'Neutral',   color: 'var(--text-primary)' },
    happy:     { emoji: '😊', label: 'Happy',      color: 'var(--accent-green)' },
    sad:       { emoji: '😢', label: 'Sad',        color: 'var(--accent-blue)' },
    angry:     { emoji: '😠', label: 'Angry',      color: 'var(--accent-red)' },
    fearful:   { emoji: '😨', label: 'Fearful',    color: 'var(--accent-purple)' },
    disgusted: { emoji: '🤢', label: 'Disgusted',  color: 'var(--accent-green)' },
    surprised: { emoji: '😲', label: 'Surprised',  color: 'var(--accent-blue)' }
};

let currentEmotion = '';
function updateEmotionUI(emotion) {
    if (emotion === currentEmotion) return;
    currentEmotion = emotion;
    const data = emotionMap[emotion] || emotionMap.neutral;

    emotionEmoji.style.transform = 'scale(0.8) translateY(-10px)';
    emotionEmoji.style.opacity = '0';

    setTimeout(() => {
        emotionEmoji.innerText = data.emoji;
        emotionLabel.innerText = data.label;
        emotionLabel.style.color = data.color;
        emotionEmoji.style.transform = 'scale(1.2) translateY(0)';
        emotionEmoji.style.opacity = '1';
        setTimeout(() => { emotionEmoji.style.transform = 'scale(1)'; }, 150);
    }, 150);
}

// Speech Recognition & Intent Logic
function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        transcriptBox.innerHTML = "<p class='placeholder-text'>Speech recognition not supported in this browser.</p>";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
                estimateIntent(event.results[i][0].transcript);
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        transcriptBox.innerHTML = `
            <span style="color: var(--text-primary); font-weight: 600;">${finalTranscript}</span>
            <span style="color: var(--text-secondary);">${interimTranscript}</span>
        `;
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
    };

    recognition.onerror = (event) => { console.error("Speech recognition error", event.error); };
    recognition.onend = () => { recognition.start(); };
    recognition.start();
}

// Intent Estimation
function estimateIntent(text) {
    text = text.toLowerCase();
    let intent = "Informing";
    let color = "var(--text-primary)";

    const requests     = ['can you', 'could you', 'please', 'help', 'i need', 'want to'];
    const greetings    = ['hello', 'hi', 'hey', 'good morning', 'good afternoon'];
    const disagreements = ['no', 'disagree', "don't think", 'wrong', 'but'];
    const agreements   = ['yes', 'agree', 'exactly', 'right', 'sure'];

    if (requests.some(kw => text.includes(kw)))      { intent = "Requesting Assistance"; color = "var(--accent-blue)"; }
    else if (greetings.some(kw => text.includes(kw))) { intent = "Greeting";              color = "var(--accent-green)"; }
    else if (disagreements.some(kw => text.includes(kw))) { intent = "Disagreeing / Defending"; color = "var(--accent-red)"; }
    else if (agreements.some(kw => text.includes(kw))) { intent = "Agreeing / Validating"; color = "var(--accent-purple)"; }

    intentDisplay.innerText = intent;
    intentDisplay.style.color = color;

    const card = intentDisplay.parentElement;
    card.style.transform = 'scale(1.02)';
    setTimeout(() => { card.style.transform = 'scale(1)'; }, 200);
}

// Boot
window.onload = loadModels;
