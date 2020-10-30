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

export const client = sanityClient({
  projectId: 'oe56ky4i',
  dataset: 'production',
  // or leave blank to be anonymous user
  useCdn: false, // `false` if you want to ensure fresh data
});

export const fetchMessages = async () => {
  let response = await Client.fetch(
    "*[_type == 'message'] | order(commentAdded desc)"
  );
  if (response) {
    response.forEach((r) => {
      //prepares array of "paragraphs" for the html parser
      let compiledHTML = '<span>';
      r.message.forEach((m) => {
        const thisP = `<p>${m.children[0].text}</p>`;
        compiledHTML += thisP;
      });
      compiledHTML += '</span>';
      r.message = compiledHTML;
    });
    return response;
  }
};

export const fetchReferrals = async () => {
  try {
    let response = await Client.fetch("*[_type == 'referral']");

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchDirectory = async () => {
  try {
    let response = await Client.fetch("*[_type == 'profile'] | order(address)");
    return response;
  } catch (error) {
    console.log(error);
  }
};
