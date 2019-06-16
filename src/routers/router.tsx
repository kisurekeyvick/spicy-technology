import Loadable from 'react-loadable';
import { ILoadableRoute } from './interface';

export const userRouter: ILoadableRoute[] = [
    {
        path: '/user/:status',
        component: Loadable({
            loader: () => import('../containers/user/user'),
            loading: () => null,
            modules: ['user']
        }),
        key: 1,
        exact: true
    },
];

export const sliderRouter: ILoadableRoute[] = [
    {
        path: '/home',
        component: Loadable({
            loader: () => import('../containers/home/home'),
            loading: () => null,
            modules: ['home']
        }),
        key: 2,
        exact: true
    },
    {
        path: '/charts',
        component: Loadable({
            loader: () => import('../containers/chart/chart'),
            loading: () => null,
            modules: ['chart']
        }),
        key: 3,
        exact: true
    },
    {
        path: '',
        component: Loadable({
            loader: () => import('../containers/exception/exception'),
            loading: () => null,
            modules: ['exception']
        }),
        key: 300,
        exact: true
    }
];

export type ILoadableRoute = ILoadableRoute;