import Storage from "@/js/basic/Storage";
import store from "@/js/store";
import Crypto from "@/js/basic/Crypto";

export default {
    setToken: (token: string) => {
        Storage.set("jwt", token);
    },
    getToken: () => {
        return Storage.get("jwt");
    },
    delToken: () => {
        Storage.remove("jwt");
    },
    setRole: (role: string) => {
        store.commit("setUserRole", role);
    },
    setUserInfoInSession: (userInfo: Object) => {
        const base64 = Crypto.getEncode64(JSON.stringify(userInfo));
        Storage.set("userInfo", base64);
    },
    getUserInfoInSession: () => {
        const base64 = Storage.get("userInfo");
        if (base64) {
            return JSON.parse(Crypto.getDecode64(base64));
        }
        return null;
    },
    delUserInfoInSession: () => {
        Storage.remove("userInfo");
    }
}
