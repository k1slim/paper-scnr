import {SET_KEY, TRYING_TO_CONNECT_TO_ROOM, CONNECT_SUCCESSFUL} from './../constants';

export function setKey(connectKey) {
    return {
        type: SET_KEY,
        payload: {connectKey}
    };
}

export function tryToConnectToRom(connectKey) {
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