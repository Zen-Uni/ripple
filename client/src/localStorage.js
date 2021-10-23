/**
 * @description handle local storage
 */

const ITEM = "RIPPLE";

const storeItem = (key) => {
    return (data) => {
        localStorage.setItem(ITEM + key, data);
    }
}

export const getItem = (key) => {
    return localStorage.getItem(ITEM + key);
}

// store token function
export const storeToken = storeItem("token");
