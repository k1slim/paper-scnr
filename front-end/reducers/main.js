import {createReducer} from './';
import {
    SET_KEY,
    CONNECT_SUCCESSFUL,
    TOGGLE_DEVICE_TYPE,
    SET_TOUCH,
    REMOVE_TOUCH,
    SET_BUTTON
} from './../constants';

const initialState = {
    connectKey: '',
    connected: false,
    cameraDevice: window.innerWidth < '1000',
    touch: undefined
};

export default createReducer(initialState, {
    [SET_KEY]: (state, payload) => {
        return Object.assign(state, payload);
    },
    [CONNECT_SUCCESSFUL]: (state, payload) => {
        return Object.assign(state, payload);
    },
    [TOGGLE_DEVICE_TYPE]: (state, payload) => {
        return Object.assign(state, payload);
    },
    [SET_TOUCH]: (state, payload) => {
        return Object.assign(state, payload);
    },
    [REMOVE_TOUCH]: (state) => {
        return Object.assign(state, {touch: undefined});
    },
    [SET_BUTTON]: (state, payload) => {
        //TODO implement adding button logic
        return Object.assign(state);
    }
});