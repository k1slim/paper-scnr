import Vue from 'vue';
import store from './../../store';
import {tryToConnectToRoom, toggleDeviceType} from './../../actions';
import {changeRoute} from './../../actions/routerActions';
import './enter.scss';

export default Vue.component('enterView', {
    data() {
        return {
            data: this.$select('main'),
            widget: 'counter'
        };
    },
    methods: {
        submitKey: function (event) {
            store.dispatch(tryToConnectToRoom({connectKey: event.target.value, widget: this.widget}));
        },
        changeTypeOfDevice: function () {
            store.dispatch(toggleDeviceType(!this.data.cameraDevice));
        },
        goToScanView: function () {
            store.dispatch(changeRoute('#scan'));
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
            <select v-if="!data.cameraDevice" v-model="widget" class="widget-select">
                <option value="counter">
                    Counter
                </option>
                <option value="piano">
                    Piano
                </option>
            </select>
            <button style="display: none" @click="goToScanView">Go to scan view</button>
        </div>
    `
});