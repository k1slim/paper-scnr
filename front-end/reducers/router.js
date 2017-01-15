import {createReducer} from './';
import {CHANGE_ROUTE} from './../constants';

const initialState = {
    currentRoute: ''
};

export default createReducer(initialState, {
    [CHANGE_ROUTE]: (state, payload) => {
        return Object.assign(state, payload);
    }
});