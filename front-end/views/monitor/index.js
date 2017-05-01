import Vue from 'vue';

const OPTIONS = {
    width: 320,
    height: 240
};

let counterWidget;

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

        counterWidget = counter(canvasContext, OPTIONS);
    },
    beforeUpdate: function () {
        this.drawButtons();
        counterWidget(this.data.touch);
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
            {{data.touch}}
            <canvas ref="canvas"></canvas>
        </div>`
});


function counter(canvas, options) {
    let counter = 0;

    let drawCounter = function () {
        canvas.font = "20px Arial";
        canvas.fillStyle = "blue";
        canvas.fillText(counter.toString(), options.width / 2, options.height / 2);
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