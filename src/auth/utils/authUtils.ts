import { DeviceUUID } from 'device-uuid';

/**
 * Method that verify if a given string is a correct email.
 * 
 * @param {string} email  Given email to be verified.
 * @returns boolean True if the email is correct.
 */
export function checkIfEmailIsValid(email: string) {
    var validRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if there's no device_id in the localStorage and creates one.
 * The device_id is a unique identifier of the device.
 */
export function getDeviceId(): string {
    if (!localStorage.getItem('device_id')) {
        const du = new DeviceUUID().parse();
        const dua = [
            du.platform,
            du.os,
            du.cpuCores,
            du.isDesktop,
            du.isMobile,
            du.isTablet,
            du.isWindows,
            du.isLinux,
            du.isLinux64,
            du.isMac,
            du.isiPad,
            du.isiPhone,
            du.isiPod,
            du.isSmartTV,
            du.pixelDepth,
            du.isTouchScreen
        ];
        const uuid = du.hashMD5(dua.join(':'));
        localStorage.setItem('device_id', uuid);
        return uuid;
    } else {
        return localStorage.getItem('device_id')!;
    }
}

/**
 * Returns a cookie value, given the name.
 * 
 * @param {string} cname The name of the cookie.
 * @returns {string} The value of the cookie, "" if the cookie is not found.
 */
export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}