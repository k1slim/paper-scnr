import Vue from 'vue';

export default Vue.component('cameraView', {
    mounted() {
        const video = document.querySelector('video');

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
            .then(stream => {
                window.stream = stream;
                video.srcObject = stream;
            })
            .catch(error => {
                console.warn('navigator.getUserMedia error: ', error);
            });
    },
    template: `
        <div class="video-view">
            <video autoplay></video>
        </div>
    `
});
