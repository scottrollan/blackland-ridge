export default {
  name: 'message',
  type: 'document',
  title: 'Messages',
  fields: [
    {
      name: 'title',
      title: 'Message Title',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'string',
    },
    {
      name: 'newThread',
      title: 'Is this a new topic?',
      type: 'boolean',
    },
    {
      name: 'author',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'avatar',
      title: 'User Avatar',
      type: 'image',
    },
    {
      name: 'responses',
      title: 'Responses',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'message' }],
        },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string', //this will be a select option input
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      title: 'Liked By',
      name: 'likedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      title: 'Loved By',
      name: 'lovedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      title: 'Cried By',
      name: 'criedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      title: 'Laughed By',
      name: 'laughedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  initialValue: {
    newThread: false,
    category: 'General',
  },
  preview: {
    select: {
      title: 'title',
    },
  },
};
