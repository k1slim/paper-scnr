import {createReducer} from './';
import {SET_KEY, CONNECT_SUCCESSFUL} from './../constants';

const initialState = {
    connectKey: '',
    connected: false
};

export default createReducer(initialState, {
    [SET_KEY]: (state, payload) => {
        return Object.assign(state, payload);
    },
    [CONNECT_SUCCESSFUL]: (state, payload) => {
        return Object.assign(state, payload);
    }
});