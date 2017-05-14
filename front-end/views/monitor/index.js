import Vue from 'vue';

const OPTIONS = {
    width: 320,
    height: 240
};

let counterWidget;
let pianoWidget;

Vue.component('monitorView', {
    data() {
        return {
            data: this.$select('main')
        };
    },
    mounted: function () {
        const canvas = this.$refs.canvas;
        const canvasContext = this.$refs.canvas.getContext('2d');

        canvas.width = OPTIONS.width;
        canvas.height = OPTIONS.height;
        this.drawButtons();

        // counterWidget = counter(canvasContext, OPTIONS);
        pianoWidget = piano();
    },
    beforeUpdate: function () {
        this.drawButtons();
        // counterWidget(this.data.touch);
        pianoWidget(this.data.touch);
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
                canvas.stroke();
            });
        }
    },
    template: `
        <div class="monitor-view">
            <canvas ref="canvas"></canvas>
            {{ data.touch }}
        </div>`
});


function counter(canvas, options) {
    let counter = 0;

    let drawCounter = function () {
        canvas.font = "20px Arial";
        canvas.fillStyle = "blue";
        canvas.fillText(counter.toString(), options.width / 2, options.height);
    };

    let processTouch = function (touchID) {
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
    };
}

function piano() {
    const audioCtx = new (AudioContext || webkitAudioContext)();

    const notes = [
        {noteName: 'c4', frequency: 261.6},
        {noteName: 'd4', frequency: 293.7},
        {noteName: 'e4', frequency: 329.6},
        {noteName: 'f4', frequency: 349.2}
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