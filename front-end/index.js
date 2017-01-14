import Vue from 'vue';
import EnterView from 'views/enter';
import CameraView from 'views/camera';
import store from './store';

const NotFound = {template: '<p>Page not found</p>'};
const Home = {template: '<enter-view/>'};
const Camera = {template: '<camera-view/>'};

const routes = {
    '': Home,
    '#camera': Camera
};

new Vue({
    el: '#app',
    data() {
        return {
            currentRoute: window.location.hash,
            data: this.$select('main')
        };
    },
    computed: {
        ViewComponent () {
            if (this.data.connected) {
                return Camera;
            }
            else {
                return routes[this.currentRoute] || NotFound;
            }
        }
    },
    render (h) {
        return h(this.ViewComponent)
    }
});