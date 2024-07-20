document.addEventListener('DOMContentLoaded', () => {
    const speakBtn = document.getElementById('speak-btn');
    const downloadBtn = document.getElementById('download-btn');
    const textInput = document.getElementById('text-input');

    // Function to convert text to speech
    function textToSpeech(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    // Function to create audio URL
    function createAudioURL(text, callback) {
        const utterance = new SpeechSynthesisUtterance(text);
        const audioContext = new AudioContext();
        const dest = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(dest.stream);
        const chunks = [];

        const source = audioContext.createMediaStreamSource(dest.stream);
        utterance.onstart = () => {
            mediaRecorder.start();
        };
        
        utterance.onend = () => {
            mediaRecorder.stop();
        };

        mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            callback(url);
        };

        window.speechSynthesis.speak(utterance);
    }

    // Event listener for Speak button
    speakBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            textToSpeech(text);
        }
    });

    // Event listener for Download button
    downloadBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            createAudioURL(text, (url) => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'speech.wav';
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    });
});