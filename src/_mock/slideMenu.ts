import * as Mock from 'mockjs';

const menu = Mock.mock([
    {
        title: '首页',
        path: '/home',
        key: '1',
        tags: 'appstore', 
        child: []
    },
    {
        title: '图表',
        path: '/charts',
        key: '2',
        tags: 'appstore', 
        child: []
    }
]);

export const menuApi = Mock.mock('mock/slideMenu', 'post', () => {
    return menu;
});