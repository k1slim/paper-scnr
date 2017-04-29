import Vue from 'vue';
import store from './../../store';
import {sendImageData} from './../../actions';
import {
    getUserMediaWrapper,
    getProjectedImageFromCanvas,
    imageDataToMatrix,
    matrixToImageData,
    findShapes,
    detector
} from './../../utils';

const OPTIONS = {
    width: 320,
    height: 240
};

const BLACK_LIMIT = 138;

export default Vue.component('scanView', {
    mounted() {
        const video = this.$refs.video;
        video.setAttribute('width', OPTIONS.width);
        video.setAttribute('height', OPTIONS.height);

        getUserMediaWrapper(video)
            .then(() => {
                // setInterval(() => {
                //     store.dispatch(sendImageData(getProjectedImageFromCanvas(canvasContext, video, OPTIONS).width));
                // }, 5000);
            })
            .catch(error => {
                console.warn('navigator.getUserMedia error: ', error);
            });

    },
    methods: {
        drawToCanvas: function () {
            const video = this.$refs.video;
            video.setAttribute('width', OPTIONS.width);
            video.setAttribute('height', OPTIONS.height);

            const canvas = this.$refs.canvas;
            const canvasContext = this.$refs.canvas.getContext('2d');
            canvas.width = OPTIONS.width;
            canvas.height = OPTIONS.height;

            getProjectedImageFromCanvas(canvasContext, video, OPTIONS);
        },
        drawFromImageToCanvas: function () {
            const canvas = this.$refs.canvasFromImage;
            const context = canvas.getContext('2d');
            const img = this.$refs.image;

            canvas.width = OPTIONS.width;
            canvas.height = OPTIONS.height;

            const myData = getProjectedImageFromCanvas(context, img, OPTIONS);

            const processedImage = matrixToImageData(imageDataToMatrix(myData, OPTIONS, BLACK_LIMIT), context, OPTIONS);
            context.putImageData(processedImage, 0, 0);
            console.log(findShapes(imageDataToMatrix(myData, OPTIONS, BLACK_LIMIT), []))
        },
        getFromVideo: function () {
            const video = this.$refs.video;
            video.setAttribute('width', OPTIONS.width);
            video.setAttribute('height', OPTIONS.height);

            const canvas = this.$refs.canvas;
            const canvasContext = this.$refs.canvas.getContext('2d');
            canvas.width = OPTIONS.width;
            canvas.height = OPTIONS.height;

            const myDetector = detector(canvasContext, video, Object.assign({}, OPTIONS, {videoURL: "./cid.mov"}));

            myDetector.attachEvent("buttonDetected", function (button) {
                console.log("New button: ", button.id);
            });
            myDetector.attachEvent("touchStart", function (button) {
                console.log("Touch start: ", button.id);
            });
            myDetector.attachEvent("touchEnd", function (button) {
                console.log("Touch end: ", button.id);
            });
        }
    },
    template: `
        <div class="camera-view">
        <div>
            <video autoplay ref="video"></video>
            <canvas ref="canvas"></canvas>
            <button @click="drawToCanvas">Draw image from camera</button>
            <button @click="getFromVideo">Draw video from video</button>
        </div>
        <div>
            <img ref="image" src="./../../trimmed.jpg">
            <canvas ref="canvasFromImage"></canvas>
            <button @click="drawFromImageToCanvas">Draw image from image</button>
        </div>

        </div>
    `
});