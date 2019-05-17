import crypto from 'crypto-js';

/**
 * @func
 * @desc  加密
 * @param msg 
 * @param key 
 * @param iv 
 */
export function encryption(msg: string, key: string, iv: any) {
    // Converts the private key to a hexadecimal string
    let key_Hex = crypto.enc.Utf8.parse(key);
    let iv_Hex = crypto.enc.Utf8.parse(iv);

    const value = crypto.DES.encrypt(msg, key_Hex, {
		iv: iv_Hex,
		mode: crypto.mode.CBC,
		padding: crypto.pad.Pkcs7
    });
    
    // return hex string
    return value.toString();
}

/**
 * @func
 * @desc 解密
 * @param msg 密文
 * @param key 
 * @param iv 
 */
export function decryption(msg: string, key: string, iv: any) {
    // Converts the private key to a hexadecimal string
	let key_Hex = crypto.enc.Utf8.parse(key);
    let iv_Hex = crypto.enc.Utf8.parse(iv);
    
    const byteArr = crypto.DES.decrypt(
        crypto.enc.Base64.parse(msg), 
        key_Hex, 
        {
            iv: iv_Hex,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        }
    );

    // 返回utf-8格式内容
    return byteArr.toString(crypto.enc.Utf8);
}

/**
 * @func
 * @desc 32位
 * @param str 
 */
export function defaultEncode(str: string) {
    return crypto.MD5(str).toString();
}
