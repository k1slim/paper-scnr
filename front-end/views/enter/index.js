import Vue from 'vue';
import store from './../../store';
import {tryToConnectToRoom, toggleDeviceType} from './../../actions';
import './enter.scss';

export default Vue.component('enterView', {
    data() {
        return {
            data: this.$select('main')
        };
    },
    methods: {
        submitKey: function (event) {
            store.dispatch(tryToConnectToRoom(event.target.value));
        },
        changeTypeOfDevice: function () {
            store.dispatch(toggleDeviceType(!this.data.cameraDevice));
        }
    },
    template: `
        <div class="enter-view">
            <div class="enter-view-block" v-if="!data.cameraDevice">
                <h2 class="enter-view-title">
                    Monitor device
                </h2>
                <input type="text" placeholder="Type code here" @keypress.enter="submitKey"/>
            </div>
            <div class="enter-view-block" v-if="data.cameraDevice">
                <h2 class="enter-view-title">
                    Camera device
                </h2>
                <h2 class="connect-key">{{data.connectKey}}</h2>
            </div>
            <button @click="changeTypeOfDevice">Change device type</button>
        </div>
    `
});