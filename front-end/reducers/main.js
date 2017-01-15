import {createReducer} from './';
import {SET_KEY, CONNECT_SUCCESSFUL, TOGGLE_DEVICE_TYPE} from './../constants';

const initialState = {
    connectKey: '',
    connected: false,
    cameraDevice: window.innerWidth < '1000'
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
    }
});