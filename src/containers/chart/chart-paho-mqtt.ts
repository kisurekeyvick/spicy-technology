import * as paho from 'paho-mqtt';
import moment from 'moment';

export interface IRes {
    errorCode: number;
    errorMessage?: string;
    [key: string]: any;
};

const hostname: string = 'www.microspicy.com'; 
const port: number = 8083;
const clientId: string = 'web_mqtt_yaoc';
const timeout: number = 5;
const keepAlive: number = 100;
const cleanSession: boolean = false;
const ssl: boolean = false;
const userName: string = 'yao';  
const password: string = 'public';  
const topic: string = '/YAOmqtt/statustt';
export const PublishTopic = '/YAOmqtt/ctrltt';

const client = new paho.Client(hostname, port, clientId);
/** 建立客户端实例 */
const options: any = {
    invocationContext: {
        host: hostname,
        port: port,
        path: client.path,
        clientId: clientId
    },
    timeout,
    keepAliveInterval: keepAlive,
    cleanSession,
    useSSL: ssl,
    userName,  
    password,  
    onSuccess: () => { client.subscribe(topic) },   // 连接服务器
    onFailure: () => {
        console.log(`{time:" ${moment().format('YYYY-MM-DD hh:mm:ss')} ", onFailure()}`);
    }
};

client.connect(options);

export const pahoMqttClient = client;
