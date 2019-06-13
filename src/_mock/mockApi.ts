import { httpService } from '../common/utils/http/http';
import './mockIndex';

export const mockApi = {
    slideMenuList: httpService('mock/slideMenu', {})
};