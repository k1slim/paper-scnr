import Vue from 'vue';
import EnterView from 'views/enter';
import CameraView from 'views/camera';
import store from './store';

const NotFound = {template: '<p>Page not found</p>'};
const Home = {template: '<enter-view/>'};
const Camera = {template: '<camera-view/>'};
const Monitor = {template: '<p>Monitor View</p>'};

const routes = {
    '': Home,
    '#camera': Camera,
    '#monitor': Monitor
};

new Vue({
    el: '#app',
    data() {
        return {
            data: this.$select('main'),
            router: this.$select('router')
        };
    },
    computed: {
        viewComponent () {
            window.location.hash = this.router.currentRoute;
            return routes[this.router.currentRoute] || NotFound;
        }
    },
    template: `<component :is="viewComponent"/>`
});