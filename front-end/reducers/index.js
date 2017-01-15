import {combineReducers} from 'redux';
import main from './main';
import router from './router';

export default combineReducers({
    main,
    router
});

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer ? reducer(state, action.payload) : state;
    }
}