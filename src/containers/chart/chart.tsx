import * as React from 'react';
import { connect } from "react-redux";
import { Button, Form, Spin, Row, Col } from 'antd';
import { chartBtn, IChartBtn, IBtn } from './chart-config';
import * as _ from 'lodash';
import * as echarts from 'echarts';
import './chart.scss';
import * as paho from 'paho-mqtt';
import { pahoMqttClient, IRes, PublishTopic } from './chart-paho-mqtt';

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

    constructor(public props: any) {
        super(props);

        this.state = {
            isLoading: false
        };

        this.btnConfig = _.cloneDeep(chartBtn);
        this.chartRef_XCSZ1 = React.createRef();
        this.chartRef_DCSZ2 = React.createRef();
        this.chartRef_EnvTemperature = React.createRef();

        /** 注册client */
        this.client = pahoMqttClient;
        this.client.onConnectionLost = this.clientOnDisconnect;
        this.client.onMessageArrived = this.clientOnReceiveMessage;
    }

    /** 
     * @func
     * @desc client 断开连接
     */
    public clientOnDisconnect = (res: IRes) => {
        if (res.errorCode !== 0) {
            console.log(`连接已断开,${res.errorMessage}`);
        }
    }

    /**
     * @func
     * @desc client 接收消息
     */
    public clientOnReceiveMessage = (msg: any) => {
        console.log(`我的天啊！！！！！！接收到消息 ${msg}`);
        this.createChart().then(res => {
            this.setState({
                isLoading: false
            });
        });
    }

    /** 
     * @func
     * @desc client 发送消息
     */
    public clientOnSendMessage = (params: IChangeChartParams[]) => {
        const val = params.map((item: IChangeChartParams) => {
            return {
                ...item.selectedBtn.value
            };
        });
        const message = new paho.Message(JSON.stringify(val));
        message.destinationName = PublishTopic;
        this.client.send(message);
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
        this.changeChart(params);
    }

    /**
     * @func
     * @desc 点击按钮，切换数据
     */
    public changeChart = (params: IChangeChartParams[]) => {
        params.forEach((item: IChangeChartParams) => {
            item.btnCollection.btnGroup.forEach((btn: IBtn) => {
                btn.btnType = item.selectedBtn.key === btn.key ? 'primary' : 'default';
            });
        });

        this.setState({
            isLoading: true
        });

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
        const toolbox = {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        };

        /** 
         * 画chart */
        this.echarts_XCSZ1.setOption({
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: ['红色信号', '绿色信号', '白色信号']
            },
            toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    // 数据源
                    data : ['56','57','58','59','60','61']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'红色信号',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle: {normal: {
                        areaStyle: {type: 'default'}}}
                },
                {
                    name:'绿色信号',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    itemStyle: {normal: {
                        areaStyle: {color: '#5BBD2B'},
                        lineStyle: {color: '#5BBD2B'}
                    }}
                },
                {
                    name:'白色信号',
                    type:'line',
                    data:[10, -20, 20, 5, 30, 2, 0],
                    itemStyle: {normal: {
                        areaStyle: {color: '#808080'},
                        lineStyle: {color: '#808080'}
                    }}
                }
            ]
        });

        this.echarts_XCSZ2.setOption({
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: ['蓝色信号','白色信号']
            },
            toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    // 数据源
                    data : ['56','57','58','59','60','61']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'蓝色信号',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle: {normal: {
                        areaStyle: {color: '#7388C1'},
                        lineStyle: {color: '#7388C1'}
                    }}
                },
                {
                    name:'白色信号',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    itemStyle: {normal: {
                        areaStyle: {color: '#808080'},
                        lineStyle: {color: '#808080'}
                    }}
                }
            ]
        });

        this.echarts_EnvTemperature.setOption({
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: ['现场温度']
            },
            toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    // 数据源
                    data : ['56','57','58','59','60','61']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'现场温度',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle: {normal: {
                        areaStyle: {color: '#F1AF00'},
                        lineStyle: {color: '#F1AF00'}
                    }}
                }
            ]
        });

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
                                <p className="chart-item-title"><span>XCSZ1点电流监测(mA)</span></p>
                                <div className="chart-item" ref={this.chartRef_XCSZ1} style={{minHeight: '300px'}}/>
                                <p className="chart-item-title"><span>DCSZ2点电流监测(mA)</span></p>
                                <div className="chart-item" ref={this.chartRef_DCSZ2} style={{minHeight: '300px'}}/>
                                <p className="chart-item-title"><span>环境温度</span></p>
                                <div className="chart-item" ref={this.chartRef_EnvTemperature} style={{minHeight: '300px'}}/>
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