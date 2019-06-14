import { IChartBtn } from './interface';
export * from './interface';

export const initEchartStore = () => ({
    XCSZ1: {
        xAxis: [],
        series: {
            red: [],
            green: [],
            white: []
        }
    },
    XCSZ2: {
        xAxis: [],
        series: {
            blue: [],
            white: []
        }
    },
    EnvTemperature: {
        xAxis: [],
        series: {
            orange: []
        }
    }
});

export const chartBtn: IChartBtn[] = [
    {
        label: 'SCSZ 1',
        className: 'SCSZ-1',
        btnGroup: [
            {
                title: '定位允许',
                key: 'SCSZ-1-1',
                btnType: 'default',
                value: {'cmd':'X16','name':'CommandJson'}
            },
            {
                title: '反位允许',
                key: 'SCSZ-1-2',
                btnType:'default',
                value: {'cmd':'X14','name':'CommandJson'}
            },
            {
                title: '禁止信号',
                key: 'SCSZ-1-3',
                btnType:'default',
                value: {'cmd':'X10','name':'CommandJson'}
            },
            {
                title: '引导信号',
                key: 'SCSZ-1-4',
                btnType:'default',
                value: {'cmd':'X11','name':'CommandJson'}
            }
        ]
    },
    {
        label: 'SCSZ 2',
        className: 'SCSZ-2',
        btnGroup: [
            {
                title: '调车禁止',
                key: 'SCSZ-2-1',
                btnType:'default',
                value: {'cmd':'X20','name':'CommandJson'}
            },
            {
                title: '调车允许',
                key: 'SCSZ-2-2',
                btnType:'default',
                value: {'cmd':'X26','name':'CommandJson'}
            },
        ]
    }
];
