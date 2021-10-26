/**
 * @description handle local storage
 */

const ITEM = "RIPPLE";

const storeItem = (key) => {
    return (data) => {
        localStorage.setItem(ITEM + key, data);
    }
}

// remove localStorage
const removeItem = (key) => {
    return () => {
        localStorage.removeItem(ITEM + key);
    }
}

export const getItem = (key) => {
    return localStorage.getItem(ITEM + key);
}

// store token function
export const storeToken = storeItem("token");


// remove token
export const removeToken = removeItem("token");