export interface ISubmenu {
    title: string;
    path: string;
    tags: string;
    key: string;
    children: ISubmenu[];
}