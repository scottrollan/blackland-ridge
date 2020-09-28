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
      name: 'likes',
      title: 'Likes',
      type: 'number',
    },
    {
      title: 'Liked By',
      name: 'likedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'loves',
      title: 'Loves',
      type: 'number',
    },
    {
      title: 'Loved By',
      name: 'lovedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'cries',
      title: 'Cries',
      type: 'number',
    },
    {
      title: 'Cried By',
      name: 'criedBy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'laughs',
      title: 'Laughs',
      type: 'number',
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
    likes: 0,
    loves: 0,
    cries: 0,
    laughs: 0,
  },
  preview: {
    select: {
      title: 'title',
    },
  },
};
