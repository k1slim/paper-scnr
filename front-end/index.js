import Vue from 'vue';
import 'views/enter';
import 'views/camera';
import 'views/monitor';
import store from './store';
import './style/main.scss'

const NotFound = {template: '<p>Page not found</p>'};
const Home = {template: '<enter-view/>'};
const Camera = {template: '<camera-view/>'};
const Monitor = {template: '<monitor-view/>'};

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