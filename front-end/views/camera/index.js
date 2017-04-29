import Vue from 'vue';
import './camera.scss';
import store from './../../store';
import {sendImageData} from './../../actions';
import {getUserMediaWrapper, detector} from './../../utils';

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
                const myDetector = detector(canvasContext, video, OPTIONS);

                myDetector.attachEvent("buttonDetected", function (button) {
                    console.log("New button: ", button.id);
                });
                myDetector.attachEvent("touchStart", function (button) {
                    store.dispatch(sendImageData(button.id));
                    console.log("Touch start: ", button.id);
                });
                myDetector.attachEvent("touchEnd", function (button) {
                    console.log("Touch end: ", button.id);
                });
            })
            .catch(error => {
                console.warn('navigator.getUserMedia error: ', error);
            });

    },
    template: `
        <div class="camera-view">
            <video autoplay ref="video"></video>
            <canvas ref="canvas"></canvas>
        </div>
    `
});