import Vue from 'vue';
import './camera.scss';

export default Vue.component('cameraView', {
    mounted() {
        const video = this.$refs.video;

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
            .then(stream => {
                // window.stream = stream;
                video.srcObject = stream;
            })
            .catch(error => {
                console.warn('navigator.getUserMedia error: ', error);
            });
    },
    template: `
        <div class="video-view">
            <video autoplay ref="video"></video>
        </div>
    `
});
