import rootReducer from './rootReducer';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

const initState: any = {};
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({
    // 记录所有类型的操作
    predicate: (getState, action) => action.type
});

export const store = createStore(rootReducer, initState, applyMiddleware(
    sagaMiddleware,
    loggerMiddleware
));

//Todo:sagaMiddleware.run(saga文件);
