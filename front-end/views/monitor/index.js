import Vue from 'vue';
import vueSlider from 'vue-slider-component';
import './monitor.scss';

const OPTIONS = {
    width: 320,
    height: 240
};

const widgets = {
    counter,
    piano
};

let widget;

Vue.component('monitorView', {
    components: {
        vueSlider
    },
    data() {
        return {
            data: this.$select('main'),
            counterValue: 0,
            widget: ''
        };
    },
    mounted: function () {
        const canvas = this.$refs.canvas;
        const canvasContext = this.$refs.canvas.getContext('2d');

        canvas.width = OPTIONS.width;
        canvas.height = OPTIONS.height;
        this.drawButtons();

        const widgetType = location.hash.split('=')[1];
        widget = widgets[widgetType](canvasContext, OPTIONS);
        this.widget = widgetType;
    },
    watch: {
        'data.touch' () {
            this.drawButtons();
            const counter = widget(this.data.touch);
            this.setValue(counter);
        }
    },
    methods: {
        drawButtons: function () {
            const canvas = this.$refs.canvas.getContext('2d');
            canvas.clearRect(0, 0, OPTIONS.width, OPTIONS.height);
            this.data.buttons.forEach(button => {
                canvas.beginPath();
                canvas.lineWidth = "2";
                canvas.strokeStyle = button.id === this.data.touch ? "green" : "red";
                canvas.rect(button.coords[0][1], button.coords[0][0], button.coords[1][1] - button.coords[0][1], button.coords[1][0] - button.coords[0][0]);
                if (button.id === this.data.touch) {
                    canvas.fillStyle = "green";
                    canvas.fillRect(button.coords[0][1], button.coords[0][0], button.coords[1][1] - button.coords[0][1], button.coords[1][0] - button.coords[0][0]);
                }
                canvas.stroke();
            });
        },
        setValue: function (val) {
            this.counterValue = val;
        }
    },
    template: `
        <div class="monitor-view">
            <canvas ref="canvas"></canvas>
            <vue-slider v-if="widget === 'counter'" :min="-5" :max="5" v-model="counterValue"></vue-slider>
        </div>`
});

function counter(canvas, options) {
    let counter = 0;

    const drawCounter = function () {
        canvas.font = "20px Arial";
        canvas.fillStyle = "blue";
        canvas.fillText(counter.toString(), options.width / 2, options.height);
    };

    const processTouch = function (touchID) {
        if (touchID === 1) {
            counter--;
        }
        if (touchID === 2) {
            counter++;
        }
    };

    return function (touchID) {
        processTouch(touchID);
        drawCounter();
        return counter;
    };
}

function piano() {
    const audioCtx = new (AudioContext || webkitAudioContext)();

    const notes = [
        {noteName: 'c4', frequency: 261.6},
        {noteName: 'd4', frequency: 293.7},
        {noteName: 'e4', frequency: 329.6},
        {noteName: 'f4', frequency: 349.2},
        {noteName: 'g4', frequency: 392},
        {noteName: 'a4', frequency: 440},
        {noteName: 'b4', frequency: 493.9}
    ];

    function Sound(frequency) {
        this.osc = audioCtx.createOscillator();
        this.pressed = false;
        this.osc.frequency.value = frequency;
        this.osc.type = 'sine';
        this.osc.start(0);
    }

    Sound.prototype.play = function () {
        this.pressed = true;
        this.osc.connect(audioCtx.destination);
    };

    Sound.prototype.stop = function () {
        this.pressed = false;
        this.osc.disconnect();
    };

    const sounds = notes.map(note => new Sound(note.frequency));

    const playNote = function (n) {
        if (sounds[n]) {
            sounds[n].play();
        }
    };

    const endNote = function () {
        const played = sounds.filter(sound => sound.pressed);
        played[0].stop();
    };

    return function (touchID) {
        if (touchID !== undefined) {
            playNote(touchID - 1);
        }
        else {
            endNote();
        }
    };
}