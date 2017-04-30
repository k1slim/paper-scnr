import {
    SET_KEY,
    TRYING_TO_CONNECT_TO_ROOM,
    CONNECT_SUCCESSFUL,
    TOGGLE_DEVICE_TYPE,
    DETECT_TOUCH,
    DETECT_BUTTON,
    TOUCH_END,
    REMOVE_TOUCH,
    SET_TOUCH,
    SET_BUTTON
} from './../constants';

export function setKey(connectKey) {
    return {
        type: SET_KEY,
        payload: {connectKey}
    };
}

export function tryToConnectToRoom(connectKey) {
    return {
        type: TRYING_TO_CONNECT_TO_ROOM,
        payload: {connectKey}
    };
}

export function setSuccessConnection() {
    return {
        type: CONNECT_SUCCESSFUL,
        payload: {connected: true}
    };
}

export function toggleDeviceType(cameraDevice) {
    return {
        type: TOGGLE_DEVICE_TYPE,
        payload: {cameraDevice}
    };
}

export function detectTouch(touch) {
    return {
        type: DETECT_TOUCH,
        payload: {touch}
    };
}

export function touchEnd(touch) {
    return {
        type: TOUCH_END,
        payload: {touch}
    };
}

export function detectButton(button) {
    return {
        type: DETECT_BUTTON,
        payload: button
    };
}

export function setTouch(touch) {
    return {
        type: SET_TOUCH,
        payload: touch
    };
}

export function removeTouch(touch) {
    return {
        type: REMOVE_TOUCH,
        payload: touch
    };
}

export function setButton(button) {
    return {
        type: SET_BUTTON,
        payload: button
    };
}

