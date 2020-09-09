export default {
  name: 'profile',
  type: 'document',
  title: 'Profiles',
  fields: [
    {
      name: 'uid',
      title: 'User Id',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'name',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Street Address',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'photoURL',
      title: 'Photo URL',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'receiveNotifications',
      title: 'Notifications Opt-In',
      type: 'boolean',
      layout: 'checkbox',
    },
    {
      name: 'includeInDirectory',
      title: 'Include in Neighborhood Directory?',
      type: 'boolean',
      layout: 'checkbox',
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
};
