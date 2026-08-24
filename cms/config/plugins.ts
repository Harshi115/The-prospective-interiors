import type { Core } from '@strapi/strapi';
const config = (): Core.Config.Plugin => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024, // 100mb -- increase if needed for large hero images
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
export default config;