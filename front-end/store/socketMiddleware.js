import {setKey, setSuccessConnection} from './../actions';
import {changeRoute} from './../actions/routerActions';
import {TRYING_TO_CONNECT_TO_ROOM, SEND_IMAGE_DATA} from './../constants';
import io from 'socket.io-client';

let socket = null;

export function chatMiddleware(store) {
    return next => action => {
        if (socket && action.type === TRYING_TO_CONNECT_TO_ROOM) {
            socket.emit('CONNECT_TO_ROOM', action.payload);
        }
        if (socket && action.type === SEND_IMAGE_DATA) {
            socket.emit('SEND_IMAGE_DATA', action.payload);
        }

        return next(action);
    };
}

export default function (store) {
    socket = io();

    socket.on('GENERATE_KEY', data => store.dispatch(setKey(data.connectKey)));

    socket.on('SEND_IMAGE_DATA', data => {
        console.log(data);
    });

    socket.on('CONNECT_SUCCESSFUL', () => {
            if (store.store.getState().main.cameraDevice) {
                store.dispatch(changeRoute('#camera'));
            }
            else {
                store.dispatch(changeRoute('#monitor'));
            }
            store.dispatch(setSuccessConnection());
        }
    );
}