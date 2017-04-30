import Vue from 'vue';

Vue.component('monitorView', {
    data() {
        return {
            data: this.$select('main')
        };
    },
    template: `
        <div>
            {{data.touch}}
            <canvas></canvas>
        </div>`
});