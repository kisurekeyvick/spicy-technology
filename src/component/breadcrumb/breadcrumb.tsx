import * as React from 'react';
import {Breadcrumb, Icon} from 'antd';
import * as PropTypes from 'prop-types';
import { ISubmenu } from '../../containers/layout/interface';
import { ENVConfig } from '../../environment/environment';
import './breadcrumb.scss';

export default class BreadComponent extends React.Component<any, any> {
    public navArray: string[];

    static propTypes = {
        menu: PropTypes.array,
        location: PropTypes.any,
        className: PropTypes.string
    };

    constructor(public props: any) {
        super(props);

        this.navArray = [];
    }

    /**
     * 当接收到一个新的props时候，这个生命周期就会触发
     * @param nextProps 
     * @param nextContext 
     */
    public componentWillReceiveProps(nextProps: any, nextContext: any) {
        this.initMenu(nextProps);
    }

    /**
     * @desc 初始化面包屑数据
     * @param props 这个是从父级传过来的数据包含：menu(父级请求数据返回的菜单数据)，location（route返回给父组件的location信息）
     */
    public initMenu(props: any) {
        const { menu, location } = props;
        let result: string[] = [];

        const loopMenu = (item: ISubmenu, array: string[]): any => {
            // 当路径匹配的话
            if (item.path === location.pathname) {
                array.push(item.title);
                return array;
            }
            
            // 当item.child存在并且是数组
            if (item.children && item.children instanceof Array) {
                for(let i = 0; i < item.children.length; i++) {
                    const arr: string[] = [...array, ...[item.title]];
                    const loopVal = loopMenu(item.children[i], arr);

                    // 如果返回的是一个数组，直接取出来，不管后面的了(暂时就先真么处理)
                    if(loopVal && loopVal instanceof Array) {
                        return loopVal;
                    }
                }
            } else 
                return null;
        };

        if (menu && menu instanceof Array) {
            result = menu.map((item: ISubmenu) => {
                if (item) {
                    const array: string[] = [];
                    return loopMenu(item, array);
                } else
                    return null;
            });

            result = result.filter(item => item);
        }

        if (result && result.length > 0) {
            this.navArray.length = 0;
            const first: any = result[0];
            this.navArray = first;
        }
    }

    public render() {
        const breadArray: any[] = [];
        const Item = Breadcrumb.Item;

        breadArray.push(
            <Item key='home' href="/"><Icon type="home"/> 首页</Item>
        );

        this.navArray.forEach((item, index) => {
            breadArray.push(
                <Item key={index}>{item}</Item>
            );
        });

        return(
            <div className="kisure-antd-layout">
                <Breadcrumb>{breadArray}</Breadcrumb>
                {
                    ENVConfig.headSubTitle && <span className="header-subtitle">{ENVConfig.headSubTitle}</span>
                }
            </div>
        )
    }
}