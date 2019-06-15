import * as React from 'react';
import { connect } from "react-redux";
import { Button, Form, Spin, Row, Col, message, Empty } from 'antd';
import { chartBtn, IChartBtn, IBtn, initEchartStore } from './chart-config';
import * as _ from 'lodash';
import * as echarts from 'echarts';
import './chart.scss';
import * as paho from 'paho-mqtt';
import moment from 'moment';
import { pahoMqttClient, IRes, PublishTopic, options } from './chart-paho-mqtt';

interface IChangeChartParams {
    selectedBtn: IBtn; 
    btnCollection: IChartBtn;
}

class ChartContainer extends React.PureComponent<any, any> {
    /** 
     * echart 实例 
     * */
    public echarts_XCSZ1: any;
    public echarts_XCSZ2: any;
    public echarts_EnvTemperature: any;
    /** 
     * react demo对象操作实例 
     * */
    public chartRef_XCSZ1: any;
    public chartRef_DCSZ2: any;
    public chartRef_EnvTemperature: any;
    /** 
     * 按钮配置
     *  */
    public btnConfig: IChartBtn[];
    /** 
     * mqtt 另类请求
     *  */
    public client: any;
    /** 
     * echart 数据存储
     */
    public echartStore: any;

    constructor(public props: any) {
        super(props);

        this.state = {
            isLoading: false,
            disConnect: false
        };

        this.btnConfig = _.cloneDeep(chartBtn);
        this.chartRef_XCSZ1 = React.createRef();
        this.chartRef_DCSZ2 = React.createRef();
        this.chartRef_EnvTemperature = React.createRef();

        /** 注册client */
        this.client = pahoMqttClient;

        this.client.onConnectionLost = this.clientOnDisconnect;
        this.client.onMessageArrived = this.clientOnReceiveMessage;
        this.client.onConnected = this.clientOnConnected;
        
        if (!this.client.isConnected()) {
            this.client.connect(options);
        }

        this.echartStore = initEchartStore();
    }

    /** 
     * @func
     * @desc client 连接成功
     */
    public clientOnConnected  = (res: any) => {
        // console.log(`连接牛逼了,${res}`);
        message.warn('服务器已连接', 2);      
    }

    /** 
     * @func
     * @desc client 断开连接
     */
    public clientOnDisconnect = (res: IRes) => {
        if (res.errorCode !== 0) {
            console.log(`连接已断开,重试,${res.errorMessage}`);
            if (!this.client.isConnected()) {
                this.client.connect(options);
            }
        }
    }

    /**
     * @func
     * @desc client 接收消息
     */
    public clientOnReceiveMessage = (msg: any) => {
        this.formatResponseData(msg);
        console.log(`牛都222222222逼了,${msg}`);
        this.setState({
            isLoading: false,
            disConnect: false
        });

        this.createChart();
        // .then(res => {
        //     this.setState({
        //         isLoading: false,
        //         disConnect: false
        //     });
        // });      
    }

    public formatResponseData = (msg: any) => {
        var data: any = JSON.parse(msg.payloadString);
        const time: string = moment().format('YY年MM月DD日HH:mm:ss');

        if(data.name !== "FeedbackJson")
        {
            console.log(`炸了不是正确的数据,${data.name}`);
        }

        this.echartStore['XCSZ1']['xAxis'].push(time);
        this.echartStore['XCSZ1']['series']['red'].push(data.xcsz1_red.current);
        this.echartStore['XCSZ1']['series']['green'].push(data.xcsz1_green.current);
        this.echartStore['XCSZ1']['series']['white'].push(data.xcsz1_white.current);

        this.echartStore['XCSZ2']['xAxis'].push(time);
        this.echartStore['XCSZ2']['series']['blue'].push(data.dcsz2_blue.current);
        this.echartStore['XCSZ2']['series']['white'].push(data.dcsz2_white.current);

        this.echartStore['EnvTemperature']['xAxis'].push(time);
        this.echartStore['EnvTemperature']['series']['orange'].push(data.temperature);

    }

    /** 
     * @func
     * @desc client 发送消息
     */
    public clientOnSendMessage = (params: IChangeChartParams[]) => {
        /** 判断是否连接mqtt */
        if (!this.client.isConnected()) {
            message.warn('未连接，请刷新重试！', 3);
            this.setState({
                isLoading: false,
                disConnect: true
            });
            return false;
        }

        const val = params.map((item: IChangeChartParams) => {
            return item.selectedBtn.value; //modified value to a string type!
        });
        
        //to Dr.Han: did not need JSON.stringify here ,val is already a JSON String.
        //const msg = new paho.Message(JSON.stringify(val));
        const msg = new paho.Message(val[0]);
        msg.destinationName = PublishTopic;
        this.client.send(msg);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeChart);

        // /** 
        //  * XCSZ1 */
        // const domTarget_XCSZ1: any = this.chartRef_XCSZ1['current'];
        // this.echarts_XCSZ1 = echarts.init(domTarget_XCSZ1);
     
        // /** 
        //  * XCSZ2 */
        // const domTarget_DCSZ2: any = this.chartRef_DCSZ2['current'];
        // this.echarts_XCSZ2 = echarts.init(domTarget_DCSZ2);
        // /** 
        //  * 环境温度 */
        // const domTarget_EnvTemperature: any = this.chartRef_EnvTemperature['current'];
        // this.echarts_EnvTemperature = echarts.init(domTarget_EnvTemperature);


        /** 默认加载 "定位允许" "调车禁止" 数据 */
        const params: IChangeChartParams[] = [
            {
                selectedBtn: this.btnConfig[0].btnGroup[0],
                btnCollection: this.btnConfig[0]
            },
            {
                selectedBtn: this.btnConfig[1].btnGroup[0],
                btnCollection: this.btnConfig[1]
            }
        ];

        params.forEach((item: IChangeChartParams) => {
            item.btnCollection.btnGroup.forEach((btn: IBtn) => {
                btn.btnType = item.selectedBtn.key === btn.key ? 'primary' : 'default';
            });
        });

        //不要一上来就发送
        //this.changeChart(params);

    }

    /**
     * @func
     * @desc 点击按钮，发送数据数据
     */
    public changeChart = (params: IChangeChartParams[]) => {
        params.forEach((item: IChangeChartParams) => {
            item.btnCollection.btnGroup.forEach((btn: IBtn) => {
                btn.btnType = item.selectedBtn.key === btn.key ? 'primary' : 'default';
            });
        });

        //不存在需要切换图表
        // this.setState({
        //     isLoading: true
        // });

        this.clientOnSendMessage(params);
    }

    /**
     * @func
     * @desc 创建按钮表单
     */
    public buildChartBtn = () => {
        const btnCfg: IChartBtn[] = this.btnConfig;
        const labelCol = {
            xs: { span: 24 },
            md: { span: 2 },
            sm: { span: 24 }
        };

        return <Form layout="horizontal">
                    {
                        btnCfg.map((item: IChartBtn, i: number) => {
                            return <Form.Item className='form-btn-group' label={item.label} key={i} labelCol={labelCol}>
                                {
                                    item.btnGroup.map((btn: IBtn) => {
                                        return <Button type={btn.btnType || 'default'} key={btn.key} onClick={() => this.changeChart([{selectedBtn: btn, btnCollection: item}])}>
                                            { btn.title }
                                        </Button>
                                    })
                                }
                            </Form.Item>
                        })
                    }
                </Form>;
    }

    /**
     * @func
     * @desc 修改图表size
     */
    public resizeChart = () => {
        this.echarts_XCSZ1 && this.echarts_XCSZ1.resize();
        this.echarts_XCSZ2 && this.echarts_XCSZ2.resize();
        this.echarts_EnvTemperature && this.echarts_EnvTemperature.resize();
    }

    /**
     * @func
     * @desc 构建图表
     */
    public createChart = ():Promise<any> => {

                /** 
         * XCSZ1 */
        const domTarget_XCSZ1: any = this.chartRef_XCSZ1['current'];
        this.echarts_XCSZ1 = echarts.init(domTarget_XCSZ1);
        console.log(`牛真的逼了,${domTarget_XCSZ1}`);
     
        /** 
         * XCSZ2 */
        const domTarget_DCSZ2: any = this.chartRef_DCSZ2['current'];
        this.echarts_XCSZ2 = echarts.init(domTarget_DCSZ2);
        /** 
         * 环境温度 */
        const domTarget_EnvTemperature: any = this.chartRef_EnvTemperature['current'];
        this.echarts_EnvTemperature = echarts.init(domTarget_EnvTemperature);


        /** 
         * 配置 */
        /*const toolbox = {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        };*/

        var chartXCSZ1_option = {
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
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.echartStore['XCSZ1']['xAxis']
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
            }],
            series: [
                {
                    name:'红色单元电流(mA)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    data: this.echartStore['XCSZ1']['series']['red']
                },
                {
                    name:'绿色单元电流(mA)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#32CD32'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#008000'
                        }, {
                            offset: 1,
                            color: '#32CD32'
                        }])
                    },
                    data: this.echartStore['XCSZ1']['series']['green']
                },
                {
                    name:'白色单元电流(mA)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#E1FFFF'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#AFEEEE'
                        }, {
                            offset: 1,
                            color: '#E1FFFF'
                        }])
                    },
                    data: this.echartStore['XCSZ1']['series']['white']
                }
                
            ]
        };

        var chartXCSZ2_option = {
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
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  this.echartStore['EnvTemperature']['xAxis']
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
            }],
            series: [
                {
                    name:'蓝色单元电流(mA)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#1E90FF'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: '#1E90FF'
                        }])
                    },
                    data: this.echartStore['XCSZ2']['series']['blue']
                },
                {
                    name:'白色单元电流(mA)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#E1FFFF'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#AFEEEE'
                        }, {
                            offset: 1,
                            color: '#E1FFFF'
                        }])
                    },
                    data: this.echartStore['XCSZ2']['series']['white']
                }
            ]
        };

        var chartEnvTemp_option = {
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
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.echartStore['EnvTemperature']['xAxis']
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
            }],
            series: [
                {
                    name:'温度(°C)',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color:  '#F1AF00'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color:  '#F1AF00'
                        }])
                    },
                    data: this.echartStore['EnvTemperature']['series']['orange']
                }
            ]
        };

        /** 
         * 画chart */
        this.echarts_XCSZ1.setOption(chartXCSZ1_option);

        this.echarts_XCSZ2.setOption(chartXCSZ2_option);

        this.echarts_EnvTemperature.setOption(chartEnvTemp_option);

        return Promise.resolve('success');
    }

    public render() {
        return (
            <div className='chart-box'>
                <div className='chart-btn-box'>
                    { this.buildChartBtn() }
                </div>
                <div className='chart-content'>
                    <Spin tip="Loading..." spinning={this.state.isLoading}>
                        <Row>
                            <Col>
                                <p className="chart-item-title"><span>XCSZ1监测</span></p>
                                { this.state.disConnect ? <Empty className='echart-noData'/> : <div className="chart-item" ref={this.chartRef_XCSZ1} style={{minHeight: '300px'}}/> }
                                <p className="chart-item-title"><span>DCSZ2监测</span></p>
                                { this.state.disConnect ? <Empty className='echart-noData'/> : <div className="chart-item" ref={this.chartRef_DCSZ2} style={{minHeight: '300px'}}/> }
                                <p className="chart-item-title"><span>环境监测</span></p>
                                { this.state.disConnect ? <Empty className='echart-noData'/> : <div className="chart-item" ref={this.chartRef_EnvTemperature} style={{minHeight: '300px'}}/> }
                            </Col>
                        </Row>
                    </Spin>
                </div>
            </div>
        );
    }

    /**
     * @func  
     * @desc 卸载相关监听
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeChart);
    }
}

function mapStateToProps(state: any) {
    return {
        // menu: state.saasCommon.menu
    }
}

function mapDispatchToProps() {
    return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(ChartContainer); 