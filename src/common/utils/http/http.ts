import axios from 'axios';

interface IOptions {
    [key: string]: any;
}

const axiosMethod = (url: string, config: any) => {

}

class HttpService {
    private _headers: any;
    private _config: any;

    constructor(public url: string, options: IOptions) {
        this._headers['Content-Type'] = 'application/json';

        this._config = {
            headers: this._headers,
            credentials: 'include'
        };
    }

    get(config: any) {
        return axiosMethod(this.url, { ...this._config, ...config });
    }

    post(bodyParams: any, config: any) {
        
    }

    uploadFile() {

    }

    delete() {

    }

    put() {

    }

    patch() {

    }
}

export const httpService = (url: string, options: IOptions) => {
    return new HttpService(url, options);
}
