import Vue from 'vue';
import store from './../store';
import {tryToConnectToRom} from './../actions';

export default Vue.component('enterView', {
    data() {
        return {
            data: this.$select('main')
        };
    },
    methods: {
        submitKey: (event) => {
            store.dispatch(tryToConnectToRom(event.target.value));
        }
    },
    template: `
        <div class="enter-view">
            <div>
                <input type="text" placeholder="Type code" @keypress.enter="submitKey"/>
            </div>
            <div>
                {{data.connectKey}}
            </div>
            {{data.connected}}
        </div>
    `
});
