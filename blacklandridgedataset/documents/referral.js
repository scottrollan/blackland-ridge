export default {
  name: 'referral',
  type: 'document',
  title: 'Referrals',
  fields: [
    {
      name: 'category',
      title: 'Business Category',
      type: 'string',
    },
    {
      title: 'Business Sub-category',
      name: 'subcategory',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'name',
      title: 'Business Name',
      type: 'string',
    },
    // {
    //   name: 'start',
    //   title: 'Start Date,',
    //   type: 'datetime',
    //   options: {
    //     dateFormat: 'MM-DD-YYYY',
    //     timeFormat: 'HH:mm',
    //     timeStep: 15,
    //   },
    // },
    // {
    //   name: 'end',
    //   title: 'End Date',
    //   type: 'datetime',
    //   options: {
    //     dateFormat: 'MM-DD-YYYY',
    //     timeFormat: 'HH:mm',
    //     timeStep: 15,
    //   },
    // },
    {
      name: 'comments',
      type: 'string',
      title: 'Comments',
    },
    {
      name: 'link1',
      type: 'url',
      title: 'Website (if any) in this form: http://google.com',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Street Address (if any)',
      type: 'string',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Rating',
    },
    {
      name: 'numberOfRatings',
      type: 'number',
      title: 'Number of Times Rated',
    },
    {
      name: 'recommendedBy',
      type: 'string',
      title: 'Person who orignially recommended:',
    },
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
};