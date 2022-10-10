declare var require;
const forge = require('node-forge');

export class EncryptionFunctions {

    public static ENCRYPT_OBJ(value: any): any {
        let result = '';
        try {
            result = forge.util.encode64(forge.util.encodeUtf8(JSON.stringify(value)));
        } catch (e) {
        }
        return result;
    }

    public static DECRYPT_OBJ(value: any, key?: string): any {
        if (value && value != null) {
            let result = '';
            try {
                result = JSON.parse(forge.util.decodeUtf8(forge.util.decode64(value.toString())));
            } catch (e) {
                localStorage.setItem(key, '');
            }
            return result;
        }
        return '';
    }
}

