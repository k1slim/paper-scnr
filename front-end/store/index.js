import Vue from 'vue';
import Revue from 'revue';
import {createStore, applyMiddleware} from 'redux';
import reducer from './../reducers';
import * as actions from './../actions';
import startChat, {chatMiddleware} from './socketMiddleware';

const createStoreWithMiddleware = applyMiddleware(chatMiddleware)(createStore);
const reduxStore = createStoreWithMiddleware(reducer);
const store = new Revue(Vue, reduxStore, actions);

startChat(store);

export default store;

const ENV = process.env.NODE_ENV;
if (ENV === 'development') {
    window.thisStore = store;
}