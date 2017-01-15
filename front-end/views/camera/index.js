import Vue from 'vue';
import './camera.scss';
import store from './../../store';
import {sendImageData} from './../../actions';

const OPTIONS = {
    width: 320,
    height: 240
};

export default Vue.component('cameraView', {
    mounted() {
        const video = this.$refs.video;
        video.setAttribute('width', OPTIONS.width);
        video.setAttribute('height', OPTIONS.height);

        const canvas = this.$refs.canvas;
        const canvasContext = this.$refs.canvas.getContext('2d');
        canvas.width = OPTIONS.width;
        canvas.height = OPTIONS.height;

        getUserMediaWrapper(video)
            .then(() => {
                setInterval(() => {
                    store.dispatch(sendImageData(getProjectedImageFromCanvas(canvasContext, video).width));
                }, 5000);
            })
            .catch(error => {
                console.warn('navigator.getUserMedia error: ', error);
            });

    },
    methods: {},
    template: `
        <div class="camera-view">
            <video autoplay ref="video"></video>
            <canvas ref="canvas"></canvas>
        </div>
    `
});

function getUserMediaWrapper(video) {
    return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(stream => {
            video.srcObject = stream;
        })
}

function getProjectedImageFromCanvas(canvas, video) {
    canvas.drawImage(video, 0, 0, OPTIONS.width, OPTIONS.height);
    return canvas.getImageData(0, 0, OPTIONS.width, OPTIONS.height);
}