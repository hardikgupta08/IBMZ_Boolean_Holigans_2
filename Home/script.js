const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const resultDiv = document.getElementById('result');
const textResultDiv = document.getElementById('text-result');

let recording = false;
let audioChunks = [];

startRecordingButton.addEventListener('click', () => {
    recording = true;
    audioChunks = [];
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'block';

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                fetch('/convert', {
                    method: 'POST',
                    body: audioBlob,
                })
                .then(response => response.json())
                .then(data => {
                    textResultDiv.textContent = data.result;
                    resultDiv.style.display = 'block';
                });
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
        })
        .catch(error => {
            console.error('Error accessing the microphone:', error);
        });
});

stopRecordingButton.addEventListener('click', () => {
    recording = false;
    startRecordingButton.style.display = 'block';
    stopRecordingButton.style.display = 'none';
});
