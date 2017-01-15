import {
    SET_KEY,
    TRYING_TO_CONNECT_TO_ROOM,
    CONNECT_SUCCESSFUL,
    TOGGLE_DEVICE_TYPE,
    SEND_IMAGE_DATA
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

export function sendImageData(imageData) {
    return {
        type: SEND_IMAGE_DATA,
        payload: {imageData}
    };
}