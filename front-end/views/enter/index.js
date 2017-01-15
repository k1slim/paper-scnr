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
                <div>Monitor device</div>
                <input type="text" placeholder="Type code" @keypress.enter="submitKey"/>
            </div>
            <div class="enter-view-block" v-if="data.cameraDevice">
                <div>Camera device</div>
                {{data.connectKey}}
            </div>
            <button @click="changeTypeOfDevice">Change device type</button>
        </div>
    `
});