// const SANITY_KEY = process.env.REACT_APP_SANITY_KEY;

const sanityClient = require('@sanity/client');
export const Client = sanityClient({
  projectId: 'oe56ky4i',
  dataset: 'production',
  token:
    'skbKhoxaursmUPAigMKQnSM6HYbTJZ0yASm6jPENyE2cl8SuroGqUqSRr4RyRcRb8AV13xpiK5szBkcr87jtXJAqTT8YhIOclIRKLJnJ0qdVgGZ02HU1fOpclixrYnbpr8JN1utUhwd1k6Xhe8BoRarSzdXc9mGmEDHUyhmwXxQB4TI9ym6D',
  useCdn: false, // `false` if you want to ensure fresh data
  ignoreBrowserTokenWarning: true,
});

export const fetchEvents = () => {
  Client.fetch("*[_type == 'event'] | order(start)");
};
