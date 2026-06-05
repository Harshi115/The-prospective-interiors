import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'projectType',
      type: 'select',
      options: [
        'Residential',
        'Commercial',
        'Hospitality',
        'Industrial',
        'Healthcare',
        'Other',
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'submittedAt',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      options: ['New', 'Contacted', 'Closed'],
    },
  ],
}