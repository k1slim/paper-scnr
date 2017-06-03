import {
    setKey,
    setSuccessConnection,
    setTouch,
    removeTouch,
    setButton
} from './../actions';
import {changeRoute} from './../actions/routerActions';
import {
    TRYING_TO_CONNECT_TO_ROOM,
    DETECT_TOUCH,
    DETECT_BUTTON,
    TOUCH_END
} from './../constants';
import io from 'socket.io-client';

let socket = null;

export function chatMiddleware() {
    return next => action => {
        if (socket && action.type === TRYING_TO_CONNECT_TO_ROOM) {
            socket.emit('CONNECT_TO_ROOM', action.payload);
        }
        if (socket && action.type === DETECT_TOUCH) {
            socket.emit('DETECT_TOUCH', action.payload);
        }
        if (socket && action.type === TOUCH_END) {
            socket.emit('TOUCH_END', action.payload);
        }
        if (socket && action.type === DETECT_BUTTON) {
            socket.emit('DETECT_BUTTON', action.payload);
        }

        return next(action);
    };
}

export default function (store) {
    socket = io();

    socket.on('GENERATE_KEY', data => store.dispatch(setKey(data.connectKey)));

    socket.on('DETECT_TOUCH', data => {
        if (store.store.getState().router.currentRoute !== '#camera') {
            store.dispatch(setTouch(data));
            console.log("Touch start: ", data);
        }
    });

    socket.on('TOUCH_END', data => {
        if (store.store.getState().router.currentRoute !== '#camera') {
            store.dispatch(removeTouch(data));
            console.log("Touch end: ", data);
        }
    });

    socket.on('DETECT_BUTTON', data => {
        if (store.store.getState().router.currentRoute !== '#camera') {
            store.dispatch(setButton(data));
            console.log("New button: ", data);
        }
    });

    socket.on('CONNECT_SUCCESSFUL', (widget) => {
            if (store.store.getState().main.cameraDevice) {
                store.dispatch(changeRoute('#camera'));
            }
            else {
                store.dispatch(changeRoute(`#monitor?widget=${widget}`));
            }
            store.dispatch(setSuccessConnection());
        }
    );
}