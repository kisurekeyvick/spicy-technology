import * as React from 'react';
import { connect } from "react-redux";
import { Button, Form, Spin, Row, Col, message, Empty } from 'antd';
import { chartBtn, IChartBtn, IBtn, initEchartStore, chartXCSZ1_config, chartXCSZ2_config, chartEnvTemp_config} from './chart-config';
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
    public chartRef_XCSZ2: any;
    public chartRef_EnvTemperature: any;
    /** 
     * 按钮配置
     *  */
    public btnConfig: IChartBtn[];
    /** 
     * mqtt 另类请求
     *  */
    public client: any;
    public clientState: any;
    /** 
     * echart 数据存储
     */
    public echartStore: any;

    constructor(public props: any) {
        super(props);

        this.state = {
            isLoading: false,
            disConnect: true,
            clickBtnCount: 0
        };

        this.clientState = {
            isConnected: false
        };

        this.btnConfig = _.cloneDeep(chartBtn);
        this.chartRef_XCSZ1 = React.createRef();
        this.chartRef_XCSZ2 = React.createRef();
        this.chartRef_EnvTemperature = React.createRef();

        /** 注册client */
        this.client = Object.assign(pahoMqttClient, {
            onConnectionLost: this.clientOnDisconnect,
            onMessageArrived: this.clientOnReceiveMessage,
            onConnected: this.clientOnConnected
        });
        !this.client.isConnected() && this.client.connect(options);

        this.echartStore = initEchartStore();
    }

    /** 
     * @func
     * @desc client 连接成功
     */
    public clientOnConnected  = (res: any) => {
        if (!this.clientState['isConnected']) {
            message.success('服务器已连接', 2);
            this.setState({
                disConnect: false,
                isLoading: true
            });
            this.clientState['isConnected'] = true;
        }
    }

    /** 
     * @func
     * @desc client 断开连接
     */
    public clientOnDisconnect = (res: IRes) => {
        if (res.errorCode !== 0) {
            this.clientState['isConnected'] = true;

            /** 如果断开连接，那么久进行重连 */
            !this.client.isConnected() && this.client.connect(options);
        }
    }

    /**
     * @func
     * @desc client 接收消息
     */
    public clientOnReceiveMessage = (msg: any) => {
        this.formatResponseData(msg);

        this.setState({
            isLoading: false,
            disConnect: false
        });

        this.createChart();    
    }

    public formatResponseData = (msg: any) => {
        var data: any = JSON.parse(msg.payloadString);
        const time: string = moment().format('YY年MM月DD日HH:mm:ss');

        if(data.name !== "FeedbackJson"){
            throw new Error(`数据格式错误,${data.name}`);
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
        const msg = new paho.Message(val[0]);
        msg.destinationName = PublishTopic;
        this.client.send(msg);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeChart);

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
        this.btnActive(params);
    }

    /** 
     * @func
     * @desc 按钮颜色激活
     */
    public btnActive = (params: IChangeChartParams[]) => {
        params.forEach((item: IChangeChartParams) => {
            item.btnCollection.btnGroup.forEach((btn: IBtn) => {
                btn.btnType = item.selectedBtn.key === btn.key ? 'primary' : 'default';
            });
        });
    }

    /**
     * @func
     * @desc 点击按钮，发送数据数据
     */
    public changeChart = (params: IChangeChartParams[]) => {
        this.btnActive(params);

        this.clientOnSendMessage(params);

        this.setState({
            clickBtnCount: this.state.clickBtnCount + 1
        });
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
     
        /** 
         * XCSZ2 */
        const domTarget_XCSZ2: any = this.chartRef_XCSZ2['current'];
        this.echarts_XCSZ2 = echarts.init(domTarget_XCSZ2);
        /** 
         * 环境温度 */
        const domTarget_EnvTemperature: any = this.chartRef_EnvTemperature['current'];
        this.echarts_EnvTemperature = echarts.init(domTarget_EnvTemperature);

        const chartXCSZ1_option = { ...chartXCSZ1_config, 
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.echartStore['XCSZ1']['xAxis']
            },
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

        const chartXCSZ2_option = { ...chartXCSZ2_config,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  this.echartStore['EnvTemperature']['xAxis']
            },
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

        const chartEnvTemp_option = { ...chartEnvTemp_config,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.echartStore['EnvTemperature']['xAxis']
            },
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
                                <p className="chart-item-title"><span>XCSZ1信号机发光单元电流监测</span></p>
                                { this.state.disConnect ? <Empty className='echart-noData'/> : <div className="chart-item" ref={this.chartRef_XCSZ1} style={{minHeight: '300px'}}/> }
                                <p className="chart-item-title"><span>DCSZ2信号机发光单元电流监测</span></p>
                                { this.state.disConnect ? <Empty className='echart-noData'/> : <div className="chart-item" ref={this.chartRef_XCSZ2} style={{minHeight: '300px'}}/> }
                                <p className="chart-item-title"><span>环境温度监测</span></p>
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