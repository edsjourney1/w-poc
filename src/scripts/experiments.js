const EXPERIMENTS = {
  AUDIENCES: {
    types: {
      mobile: () => window.innerWidth < 600,
      desktop: () => window.innerWidth >= 600,
      // us: async () => (await geoPromise).region === 'us',
      // eu: async () => (await geoPromise).region === 'eu',
    },
    params: {
      audiencesMetaTagPrefix: 'audience',
      audiencesQueryParameter: 'audience',
    },
  },
  CONTENTS: {
    params: {
      campaignsMetaTagPrefix: 'content',
      campaignsQueryParameter: 'content',
    },
  },
  VARIANTS: {
    params: {
      experimentsMetaTag: 'variant',
      experimentsQueryParameter: 'variant',
    },
  },
};

export { EXPERIMENTS };
