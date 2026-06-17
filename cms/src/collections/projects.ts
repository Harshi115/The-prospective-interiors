import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'sector',
      type: 'select',
      options: [
        'Hospitality',
        'Industrial',
        'Healthcare',
        'Retail',
        'Residential',
        'Commercial',
        'Civic',
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'area',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
        