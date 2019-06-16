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
                value: "{\"cmd\":\"X16\",\"name\":\"CommandJson\"}"
            },
            {
                title: '反位允许',
                key: 'SCSZ-1-2',
                btnType:'default',
                value: "{\"cmd\":\"X14\",\"name\":\"CommandJson\"}"
            },
            {
                title: '禁止信号',
                key: 'SCSZ-1-3',
                btnType:'default',
                value: "{\"cmd\":\"X10\",\"name\":\"CommandJson\"}"
            },
            {
                title: '引导信号',
                key: 'SCSZ-1-4',
                btnType:'default',
                value: "{\"cmd\":\"X11\",\"name\":\"CommandJson\"}"
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
                value: "{\"cmd\":\"X20\",\"name\":\"CommandJson\"}"
            },
            {
                title: '调车允许',
                key: 'SCSZ-2-2',
                btnType:'default',
                value: "{\"cmd\":\"X26\",\"name\":\"CommandJson\"}"
            },
        ]
    }
];

export const chartXCSZ1_config: any = {
    tooltip: {
        trigger: 'axis',
        position: function (pt: any[]) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'XCSZ1信号机发光单元电流监测',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        //start: 30,
        //end: 100
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }]
};

export const chartXCSZ2_config: any = {
    tooltip: {
        trigger: 'axis',
        position: function (pt: any[]) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'DCSZ2信号机发光单元电流监测',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        //start: 30,
        //end: 100
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }]
};

export const chartEnvTemp_config: any = {
    tooltip: {
        trigger: 'axis',
        position: function (pt: any[]) {
            return [pt[0], '80%'];
        }
    },
    title: {
        left: 'center',
        text: '环境温度监测',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        //start: 30,
        //end: 100
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }]
};
