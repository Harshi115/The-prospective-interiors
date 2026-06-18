import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { cloudinaryAdapter } from '@payloadcms/plugin-cloud-storage/cloudinary'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/projects'
import { Services } from './collections/Services'
import { TeamMembers } from './collections/TeamMembers'
import { Stats } from './collections/Stats'
import { Pages } from './collections/Pages'
import { Inquiries } from './collections/Inquiries'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Services, TeamMembers, Stats, Pages, Inquiries],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter({
            config: {
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
              api_key: process.env.CLOUDINARY_API_KEY || '',
              api_secret: process.env.CLOUDINARY_API_SECRET || '',
            },
          }),
        },
      },
    }),
  ],
})
