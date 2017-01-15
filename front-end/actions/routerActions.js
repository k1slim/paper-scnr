import {CHANGE_ROUTE} from './../constants';

export function changeRoute(currentRoute) {
    return {
        type: CHANGE_ROUTE,
        payload: {currentRoute}
    };
}