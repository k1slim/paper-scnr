import Vue from 'vue';
import EnterView from 'views/enter';
import CameraView from 'views/camera';
import MonitorView from 'views/monitor';
import ScanView from 'views/scan';
import store from './store';
import './style/main.scss'

const NotFound = {template: '<p>Page not found</p>'};
const Home = {template: '<enter-view/>'};
const Camera = {template: '<camera-view/>'};
const Monitor = {template: '<monitor-view/>'};
const Scan = {template: '<scan-view/>'};

const routes = {
    '': Home,
    '#camera': Camera,
    '#monitor?widget=piano': Monitor,
    '#monitor?widget=counter': Monitor,
    '#scan': Scan
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
    template: `
        <div>
            <header>
                <h1>
                    Paper scnr
                </h1>
            </header>
            <section class="content">
                <component :is="viewComponent"/>
            </section>
        </div>
    `
});