import {combineReducers} from 'redux';
import main from './main';

export default combineReducers({
    main
});


export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer ? reducer(state, action.payload) : state;
    }
}