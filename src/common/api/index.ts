import { httpService } from '../utils/http/http';

export const api = {
    login: httpService(`/project1/login`, {}),
    getRandCode: httpService(`/project1/getRandCode`, {}),
};
