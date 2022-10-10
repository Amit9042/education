import { Injectable } from '@angular/core';
import {
    Driver,
    NgForageOptions,
    DedicatedInstanceFactory,
    NgForageCache,
    InstanceFactory
} from 'ngforage';

@Injectable({
    providedIn: 'root'
})
export class ForageService {
    documentOption: NgForageOptions = {
        name: 'Documents',
        cacheTime: 2628000000, //1 month in milliseconds
        driver: Driver.INDEXED_DB
    };
    cacheStore: NgForageCache;
    isSupportCache: boolean = false;

    constructor(
        private readonly factory: DedicatedInstanceFactory,
        private readonly instance: InstanceFactory
    ) {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB");
        } else {
            this.isSupportCache = true;
            this.cacheStore = this.factory.createCache(this.documentOption);
        }
    }

    setDocument = async (key: string, value: any) => {
        await this.cacheStore.setCached(key, value);
    };

    getDocument = async (key: string) => {
        return await this.cacheStore.getCached(key).then(r => {
            if (!r.hasData || r.expired) {
                if (r.expired) {
                    this.removeDocument(key);
                }
                return null;
            }
            return r.data;
        });
    };

    removeDocument = async (key: string) => {
        return await this.cacheStore.removeCached(key);
    };

    destroyStore = async () => {
        await this.instance.getInstance(this.documentOption).dropInstance();
    };

    get supportCache() {
        return this.isSupportCache;
    }

    estimateSpace = () => {
        return new Promise((resolve, reject) => {
            if (navigator.storage && navigator.storage.estimate) {
                navigator.storage.estimate().then(estimate => {
                    const ut = 1024 * 1024;
                    const decimal = 3;
                    resolve({
                        total: (estimate.quota / ut).toFixed(decimal),
                        usage: (estimate.usage / ut).toFixed(decimal),
                        avai: ((estimate.quota - estimate.usage) / ut).toFixed(
                            decimal
                        )
                    });
                });
            } else {
                reject(
                    'navigator.storage.estimate: the browser is not supported'
                );
            }
        });
    };
}
