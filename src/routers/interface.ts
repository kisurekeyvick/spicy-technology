export interface IBase {
    path: string;
    exact?: boolean;
}

export interface ILoadableRoute extends IBase {
    component: any;
    [key: string]: any;
}