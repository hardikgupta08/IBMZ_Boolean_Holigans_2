document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const startRecord = document.getElementById('startRecord');
    const pauseRecord = document.getElementById('pauseRecord');
    const resumeRecord = document.getElementById('resumeRecord');
    const stopRecord = document.getElementById('stopRecord');
    const saveWav = document.getElementById('saveWav');
    const deleteMp3 = document.getElementById('deleteMp3');
    
    // Get the file input element
    const fileInput = document.querySelector('input[type="file"]');
    
    let mediaRecorder;
    let audioChunks = [];

    startRecord.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audio.src = audioUrl;
            saveWav.disabled = false;
            deleteMp3.disabled = false;

            // Set the audioBlob as the selected file in the file input
            const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
            fileInput.files = [file];
        };

        mediaRecorder.start();
        startRecord.disabled = true;
        pauseRecord.disabled = false;
        stopRecord.disabled = false;
    });

    pauseRecord.addEventListener('click', () => {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            pauseRecord.disabled = true;
            resumeRecord.disabled = false;
        }
    });

    resumeRecord.addEventListener('click', () => {
        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            pauseRecord.disabled = false;
            resumeRecord.disabled = true;
        }
    });

    stopRecord.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            startRecord.disabled = false;
            pauseRecord.disabled = true;
            resumeRecord.disabled = true;
            stopRecord.disabled = true;
        }
    });

    saveWav.addEventListener('click', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = window.URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    deleteMp3.addEventListener('click', () => {
        audioChunks = [];
        audio.src = '';
        saveWav.disabled = true;
        deleteMp3.disabled = true;
    });
});
