import Loadable from 'react-loadable';
import { IBase, ILoadableRoute } from './interface';

export const userRouter: ILoadableRoute[] = [
    {
        path: '/user/:status',
        component: Loadable({
            loader: () => import('../containers/user/user'),
            loading: () => null,
            modules: ['user']
        }),
        exact: true
    },
];
