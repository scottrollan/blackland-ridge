export default {
  name: 'event',
  type: 'document',
  title: 'Events',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subitle',
      type: 'string',
    },
    {
      name: 'start',
      title: 'Start Date,',
      type: 'datetime',
      options: {
        dateFormat: 'MM-DD-YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    },
    {
      name: 'end',
      title: 'End Date',
      type: 'datetime',
      options: {
        dateFormat: 'MM-DD-YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    },
    {
      name: 'description',
      type: 'string',
      title: 'Event Info (English)',
    },
    {
      name: 'link1Description',
      type: 'string',
      title: 'Any explanation for the first link.',
    },
    {
      name: 'link1',
      type: 'url',
      title: 'First URL to Event (if any) in this form: http://google.com',
    },
    {
      name: 'link2Description',
      type: 'string',
      title: 'Any explanation for the second link.',
    },
    {
      name: 'link2',
      type: 'url',
      title: 'Second URL to Event (if any) in this form: http://facebook.com',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'importantInfo',
      type: 'string',
      title:
        'Any emphasized information (Ex: "Register Now!!" - this will be bolded at the bottome of the event)',
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
};
