let model, maxPredictions;

async function preload() {
  const URL = 'https://teachablemachine.withgoogle.com/models/0d3-cWSc7/';
  model = await tmSound.load(URL + 'model.json', URL + 'metadata.json');
  maxPredictions = model.getTotalClasses();
}

async function setup() {
  createCanvas(400, 400);
  let audioContext = getAudioContext();
  let mic = new p5.AudioIn();
  mic.start(() => {
    audioContext.resume().then(() => {
      console.log('Audio context resumed');
    });
  });

  mic.connect();
  mic.amp(1);
  mic.output.connect(audioContext.destination);

  await preload();
  model.listen((result) => {
    gotResults(null, result);
  }, {
    overlapFactor: 0.5,
    probabilityThreshold: 0.75
  });
}

function gotResults(error, predictions) {
  if (error) {
    console.error(error);
    return;
  }

  let resultText = '';
  for (let i = 0; i < maxPredictions; i++) {
    const prediction = predictions[i];
    resultText += `${prediction.className}: ${prediction.probability.toFixed(2)}<br>`;
  }
  document.getElementById('label-container').innerHTML = resultText;

  if (predictions[0].className === '차량 소리' && predictions[0].probability > 0.8) {
    alert('차량 소리 감지됨');
  }
}
