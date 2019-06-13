type Tbtn = 'primary' | 'default' | undefined;

export interface IBtn {
    title: string;
    key: string;
    value: object;
    btnType: Tbtn;
    color?: string;
}

export interface IChartBtn {
    label: string;
    className: string;
    btnGroup: IBtn[]
}