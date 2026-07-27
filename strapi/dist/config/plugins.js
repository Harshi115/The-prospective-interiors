"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = ({ env }) => ({
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('dzmj2j8rh'),
                api_key: env('916956428227632'),
                api_secret: env('1PBpquTU9efY_5yPqE6ljHUKSKk'),
            },
            actionOptions: {
                upload: {},
                delete: {},
            },
        },
    },
});
exports.default = config;
