let button = document.getElementById('start-webcam-btn');

button.onclick = async () => {
    console.log('Webcam button clicked');

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
            async (stream) => {
                const video = document.getElementById('webcam-video');
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();

                    const modelURL = 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/2/default/1';
                    const model = await tf.loadGraphModel(modelURL);
                    const class_names = ['person', 'electronic_device'];

                    const detectFrame = async () => {
                        const input = tf.browser.fromPixels(video);
                        const predictions = await model.executeAsync(input.expandDims(0));

                        let num_persons = 0;
                        let electronic_device_detected = false;

                        for (let i = 0; i < predictions.dataSync().length; i += 7) {
                            const class_id = predictions.dataSync()[i + 1];
                            const class_name = class_names[class_id];
                            if (class_name === 'person') {
                                num_persons++;
                            } else if (class_name === 'electronic_device') {
                                electronic_device_detected = true;
                            }
                        }
                        input.dispose();

                        if (num_persons >= 2) {
                            console.log('Two or more persons detected in the frame');
                        }
                        if (electronic_device_detected) {
                            console.log('Electronic device detected in the frame');
                        }

                        requestAnimationFrame(detectFrame);
                    };

                    detectFrame();
                };
            },
            (err) => {
                console.error(`The following error occurred: ${err.name}`);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }
};
