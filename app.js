const video = document.querySelector('video');
const textElement = document.querySelector('[data-text]');

async function setup() {
  const stream =  await navigator.mediaDevices.getUserMedia({video: true});
  video.srcObject = stream;
}

setup();

video.addEventListener('playing', async () => {
    const worked = Tesseract.createWorker();
    await worked.load();
    await worked.loadLanguage('eng');
    await worked.initialize('eng');

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    document.addEventListener('keypress', async (e) => {
        if(e.code !== 'Space') return;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        const { data: { text } } = await worked.recognize(video);

        speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, ' ')));

        textElement.textContent = text;
        console.log(text);
    });

    
})