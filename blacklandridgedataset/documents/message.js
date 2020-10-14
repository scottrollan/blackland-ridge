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
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'newThread',
      title: 'Is this a new topic?',
      type: 'boolean',
    },
    {
      name: 'authorName',
      title: "Author's Name",
      type: 'string',
    },
    {
      name: 'authorRef',
      title: 'Author Reference',
      type: 'reference',
      to: [{ type: 'profile' }],
    },
    {
      name: 'avatar',
      title: 'User Avatar',
      type: 'image',
    },
    {
      title: 'Last comment date',
      name: 'commentAdded',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss.ss',
      },
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
