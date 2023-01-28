//chrome.runtime.onMessage.addViewer((msg) => {
//    if (!msg.offscreen) {
//      return;
//    }
//    switch (msg.type) {
//      case "play":
//       play(msg.play);
//        break;
//      case "pause":
//        pauseAudio();
//        break;
//    }
//  });
const video = document.querySelector('video');
const canvas = new OffscreenCanvas(video.width, video.height);
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
      drawVideo();
    };
  });

function drawVideo() {
  ctx.drawImage(video, 0, 0, video.width, video.height);
  requestAnimationFrame(drawVideo);
}
videoTrack = stream.getVideoTracks()[0];

// load the TensorFlow.js model for object and face detection
const modelURL = 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1';
const model = await tf.loadGraphModel(modelURL);

// detect objects and faces in the webcam feed
async function detect() {
while (true) {
    const predictions = await model.detect(video);
    let personCount = 0;
    let electronicDeviceCount = 0;
    for (let i = 0; i < predictions.length; i++) {
        if (predictions[i].class === 'person') {
            personCount++;}
        else if (predictions[i].class === 'electronic device') {
            electronicDeviceCount++;
        }
    }

    if (personCount >= 2) {
      alert("2 or more persons detected in the frame!");
    }
    if (electronicDeviceCount > 0) {
      alert("Electronic device detected in the frame!");
    }
    // wait for a second before detecting again
    await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
detect();


