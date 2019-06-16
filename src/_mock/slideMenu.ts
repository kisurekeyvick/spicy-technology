import * as Mock from 'mockjs';

const menu = Mock.mock([
    {
        title: '首页',
        path: '/home',
        key: '1',
        tags: 'home', 
        child: []
    },
    {
        title: '信号机监测',
        path: '/charts',
        key: '2',
        tags: 'line-chart', 
        child: []
    }
]);

export const menuApi = Mock.mock('mock/slideMenu', 'post', () => {
    return menu;
});