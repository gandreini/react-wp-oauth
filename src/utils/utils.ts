/**
 * Returns true if mobile device.
 */
export function isMobile(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the value of a GET parameter.
 * null if the parameter is not set.
 * 
 * @param {string} param Name of the parameter to retrieve.
 * 
 * @return {string} the string value of the parameter;
 */
export function getUrlParameter(
    param: string
): string | null {

    const urlParams = new URLSearchParams(document.location.search.substring(1));

    if (urlParams.has(param)) {
        return urlParams.get(param);
    } else {
        return null;
    }
}

/**
 * Sort a multidimensional array by its second column.
 */
export function sortMultiArraySecondColumn(inputArray: Array<[any, number]>): Array<[any, number]> {
    inputArray.sort(sortMultiArraySecondColumnMatch);
    return inputArray;
}

/**
 * Matching function that is used to sort (in previous function).
 */
function sortMultiArraySecondColumnMatch(a: number[] | string[], b: number[] | string[]) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}


/**
 * Returns a number with one decimal, and no decimals if that's 0.
 * 
 * @param {number} numberToFix Name of the parameter to retrieve.
 */
export function oneDecimal(numberToFix: number): number {
    return parseFloat(numberToFix.toFixed(1));
}

/**
 * Truncates a given string after N characters.
 * @param string text Given string to truncate.
 * @param characters number after how many characters to cut the string.
 * @returns text cut after N characters.
 */
export function truncateTextAfterNCharacters(text: string, characters: number): string {
    let stringToReturn: string = text;
    if (text.length > characters) {
        stringToReturn = text.substr(0, characters) + '...';
    }
    return stringToReturn;
}

/**
 * Deep cloning of objects (no need to use lodash).
 * 
 * @param object inputObject Object to be cloned.
 * @returns object Cloned object.
 */
export function cloneObject(inputObject: object): object {
    return JSON.parse(JSON.stringify(inputObject));
}

/**
 * Copy to clipboard function.
 * 
 * @param {element} elementToGetString  Form element (like an input or textarea) to copy the text from.
 * @param {string} callbackFunction     Callback function to be called after the text has been copied.
 */
export function copyToClipboard(elementToGetStringId: string, callbackFunction?: Function) {
    const element = document.getElementById(elementToGetStringId) as HTMLInputElement | HTMLTextAreaElement;
    if (element) {
        element.select();
        document.execCommand('copy');
    }

    // Callback function.
    if (callbackFunction && callbackFunction != null) {
        callbackFunction();
    }
}