export function getUserMediaWrapper(video) {
    return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(stream => {
            video.srcObject = stream;
        })
}

export function getProjectedImageFromCanvas(canvas, video, options) {
    canvas.drawImage(video, 0, 0, options.width, options.height);
    return canvas.getImageData(0, 0, options.width, options.height);
}

export function imageDataToMatrix(imageData, options, limit) {
    let matrix = [];
    for (let y = 0; y < options.height; y++) {
        matrix[y] = [];
        for (let x = 0; x < options.width; x++) {
            let index = (y * options.width + x) * 4;

            let r = imageData.data[index] ? imageData.data[index] : 0;
            let g = imageData.data[index + 1] ? imageData.data[index + 1] : 0;
            let b = imageData.data[index + 2] ? imageData.data[index + 2] : 0;

            let color = Math.round((r + g + b) / 3);
            matrix[y][x] = color > limit ? 0 : 1;
        }
    }
    return matrix;
}

export function matrixToImageData(matrix, context, options) {
    let imageData = context.createImageData(options.width, options.height);

    for (let y = 0; y < options.height; y++) {
        for (let x = 0; x < options.width; x++) {
            let index = (y * options.width + x) * 4;
            let color = matrix[y][x] ? 0 : 255;
            imageData.data[index] = color;
            imageData.data[index + 1] = color;
            imageData.data[index + 2] = color;
            imageData.data[index + 3] = 255;
        }
    }
    return imageData;
}

export function detector(canvas, video, options) {
    options.touchSensitivity = 50;
    options.sensitivity = 150;

    let loopTimer = null;

    const stopLoop = function () {
        if (loopTimer) {
            window.clearInterval(loopTimer);
            loopTimer = null;
        }
    };

    let buttons = [];
    let readyToFind = true;
    let startTime = null;

    const nextFrame = function () {
        let imageData = getProjectedImageFromCanvas(canvas, video, options),
            data = imageDataToMatrix(imageData, options, options.sensitivity);

        if (readyToFind) {
            if (!startTime) {
                startTime = (new Date()).valueOf();
            }
            buttons = findShapes(data, buttons, options);
            data = imageDataToMatrix(imageData, options, options.sensitivity);
            buttons = findStableButtons(data, buttons);
            let timeDiff = ((new Date()).valueOf() - startTime);
            if (timeDiff > 10000) {
                startTime = null;
                readyToFind = false;
            }
        }
        data = imageDataToMatrix(imageData, options, options.sensitivity);
        findTouches(data, buttons);

        imageData = matrixToImageData(data, canvas, options);
        canvas.putImageData(imageData, 0, 0);
        drawButtons(buttons);
        drawReadyToFind(readyToFind);
    };

    const findStableButtons = function (data, buttons) {
        let i,
            button;

        for (i = 0; i < buttons.length; i++) {
            button = buttons[i];
            if (!button.stable) {
                button.stable = true;
                button.isTouched = false;
                button.hash = getButtonHash(data, button.coords);
                fireEvent("buttonDetected", button);
            }
        }
        return buttons;
    };

    const findTouches = function (data, buttons) {
        let i, button, newTouchStatus;
        for (i = 0; i < buttons.length; i++) {
            button = buttons[i];
            if (button.stable) {
                newTouchStatus = isButtonTouched(data, button);
                if (button.isTouched !== newTouchStatus) {
                    button.isTouched = newTouchStatus;
                    fireEvent(button.isTouched ? "touchstart" : "touchend", button);
                }
            }
        }
    };

    const isButtonTouched = function (data, button) {
        let buttonHash = getButtonHash(data, button.coords);
        return buttonHash - button.hash > options.touchSensitivity;
    };

    const getButtonHash = function (data, coords) {
        let sum = 0,
            row,
            col;
        for (row = coords[0][0]; row <= coords[1][0]; row++) {
            for (col = coords[0][1]; col <= coords[1][1]; col++) {
                if (data[row]) {
                    sum += data[row][col] ? 1 : 0;
                }
            }
        }
        return sum;
    };

    const drawButtons = function (buttons) {
        let button;
        for (let i = 0; i < buttons.length; i++) {
            button = buttons[i];
            if (button.stable) {
                canvas.beginPath();
                canvas.lineWidth = "2";
                canvas.strokeStyle = button.isTouched ? "green" : "red";
                canvas.rect(button.coords[0][1], button.coords[0][0], button.coords[1][1] - button.coords[0][1], button.coords[1][0] - button.coords[0][0]);
                canvas.stroke();
            }
        }
    };

    const drawReadyToFind = function (isReadyToFind) {
            canvas.beginPath();
            canvas.lineWidth = "2";
            canvas.fillStyle = isReadyToFind ? "#00ff00" : "#ff0000";
            canvas.fillRect(4, 4, 20, 20);
            canvas.stroke();
        },

        events = {},
        fireEvent = function (eventName, data) {
            let handlers, i;
            eventName = eventName.toLowerCase();
            handlers = events[eventName];
            for (i = 0; i < handlers.length; i++) {
                handlers[i].call({}, data);
            }
        },
        attachEvent = function (eventName, handler) {
            eventName = eventName.toLowerCase();
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(handler);
        },
        clearButtons = function () {
            buttons = [];
            readyToFind = true;
        };


    const startLoop = function () {
        loopTimer = window.setInterval(nextFrame, 100);
    };

    video.addEventListener('loadeddata', startLoop);

    if (options.videoURL) {
        let source = document.createElement("source");
        source.setAttribute("src", options.videoURL);
        source.setAttribute("type", "video/mp4");
        video.appendChild(source);
    }

    return {
        attachEvent: attachEvent,
        clear: clearButtons
    };
}

export function findShapes(data, existingButtons, options) {
    const createTouchRect = function (shape) {
        let minX = Infinity;
        let maxX = -1;
        let minY = Infinity;
        let maxY = -1;

        for (let i = 0; i < shape.length; i++) {
            if (shape[i][0] < minX) {
                minX = shape[i][0];
            }
            if (shape[i][0] > maxX) {
                maxX = shape[i][0]
            }
            if (shape[i][1] < minY) {
                minY = shape[i][1];
            }
            if (shape[i][1] > maxY) {
                maxY = shape[i][1];
            }
        }
        return [[minX, minY], [maxX, maxY]];
    };

    const findShape = function (data) {
        let shape = [];
        let image = data;

        let boundaryPixel = findBoundaryPixel(image);
        if (!boundaryPixel) {
            return null;
        }
        let startX = boundaryPixel.white[0];
        let startY = boundaryPixel.white[1];

        let prevX = startX;
        let prevY = startY;
        let curX = boundaryPixel.black[0];
        let curY = boundaryPixel.black[1];
        let iterates = 0;

        while (true) {
            if (image[curX] && image[curX][curY] === 1) {
                shape.push([curX, curY]);
                image[curX][curY] += 1;
            }

            let nexts = chooseNextStep(prevX, prevY, curX, curY, image[curX] ? image[curX][curY] || 0 : 0);
            prevX = curX;
            prevY = curY;
            curX = nexts[0];
            curY = nexts[1];

            if (curX === startX && curY === startY) {
                break;
            }
            iterates++;
            if (iterates > 5000) {
                return null;
            }
        }
        return createTouchRect(shape);
    };

    const chooseNextStep = function (prevX, prevY, curX, curY, direction) {
        let isX = curX - prevX;
        let isY = curY - prevY;
        let stepX;
        let stepY;
        if (direction > 0) {
            direction = 1;
        } else {
            direction = -1;
        }

        if (isX === 0 && isY === 1) {
            stepX = -1 * direction;
            stepY = 0;
        }
        if (isX === 0 && isY === -1) {
            stepX = 1 * direction;
            stepY = 0;
        }
        if (isX === 1 && isY === 0) {
            stepX = 0;
            stepY = 1 * direction;
        }
        if (isX === -1 && isY === 0) {
            stepX = 0;
            stepY = -1 * direction;
        }

        let nextX = curX + stepX;
        let nextY = curY + stepY;
        return [nextX, nextY];
    };

    const findBoundaryPixel = function (image) {
        let prev, cur;
        let prevX, prevY;
        for (let i = 0; i < image.length; i++) {
            for (let j = 0; j < image[i].length; j++) {
                cur = image[i][j];
                if (cur === 1 && prev === 0) {
                    return {
                        white: [prevX, prevY],
                        black: [i, j]
                    }
                }
                prev = cur;
                prevX = i;
                prevY = j;
            }
        }
    };

    const subtract = function (data, button) {
        let x0 = Math.max(button[0][1] - 10, 0),
            x1 = Math.min(button[1][1] + 10, data[0] ? data[0].length : 0),
            y0 = Math.max(button[0][0] - 10, 0),
            y1 = Math.min(button[1][0] + 10, data.length);

        for (let row = y0; row <= y1; row++) {
            for (let col = x0; col <= x1; col++) {
                if (data[row]) {
                    data[row][col] = 0;
                }
            }
        }
        return data;
    };

    const isFilled = function (data) {
        let filled = 0,
            height = data.length,
            width = data[0] ? data[0].length : 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                filled += data[i][j] ? 1 : 0;
            }
        }
        return filled / (width * height) > 0.3;
    };

    const isEmpty = function (data) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };

    const isButton = function (button) {
        let minSize = 10;
        return (button[1][0] - button[0][0] > minSize) && (button[1][1] - button[0][1] > minSize);
    };

    const cropArea = function (data, coords) {
        let cropedData = [],
            extendSize = 0,
            minX = Math.max(0, coords[0][1] - extendSize),
            maxX = Math.min(options.width - 1, coords[1][1] + extendSize),
            minY = Math.max(0, coords[0][0] - extendSize),
            maxY = Math.min(options.width - 1, coords[1][0] + extendSize);

        for (let row = minY, i = 0; row <= maxY; row++, i++) {
            cropedData[i] = [];
            for (let col = minX, j = 0; col <= maxX; col++, j++) {
                if (data[row]) {
                    cropedData[i][j] = data[row][col] || 0;
                }
            }
        }
        return cropedData;
    };

    const getButtonSquare = function (coords) {
        return (coords[1][1] - coords[0][1]) * (coords[1][0] - coords[0][0]);
    };

    const uuid = (function () {
        let index = 1;
        return function () {
            return index++;
        }
    })();
    let found = true,
        button = null,
        buttons = [];

    for (let i = 0; i < existingButtons.length; i++) {
        button = findShape(cropArea(data, existingButtons[i].coords));
        if (button) {
            if (getButtonSquare(button) / getButtonSquare(existingButtons[i].coords) < 0.7) {
                button = existingButtons[i].coords;
            } else {
                button[0][0] += existingButtons[i].coords[0][0];
                button[0][1] += existingButtons[i].coords[0][1];
                button[1][0] += existingButtons[i].coords[0][0];
                button[1][1] += existingButtons[i].coords[0][1];
            }
            if (isButton(button)) {
                existingButtons[i].coords = button;
                buttons.push(existingButtons[i]);
            }
            data = subtract(data, button);
        }
    }
    while (!isEmpty(data) && !isFilled(data) && found && buttons.length < 8) {
        button = findShape(data);
        if (button) {
            if (isButton(button)) {
                buttons.push({
                    id: uuid(),
                    //sum: getButtonHash(data, button),
                    coords: button
                });
            }
            data = subtract(data, button);
        } else {
            found = false;
        }
    }
    return buttons;
}

