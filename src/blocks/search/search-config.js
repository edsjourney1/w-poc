const suggestionURL = 'https://nwzqv94hr0.execute-api.us-east-1.amazonaws.com/dev/v1/search';
const suggestionQuery = `query Suggest($term: String!, $language: LanguageEnum = EN, $limit: Int = 5, $audience: AudienceEnum = ALL_AUDIENCE) {
  suggest(term: $term, language: $language, limit: $limit, audience: $audience) {
    items {
      WELLMARK_COM {
        highlights
      }
      WELLMARK_BLUE {
        highlights
      }
    }
  }
}`;
export { suggestionURL, suggestionQuery };

export const searchURL = 'https://apigw-sit.wellmark.com/wellmark-com-open-search/v1/search';

export const searchQuery = `query Search(
$q: String!
$language: LanguageEnum = EN
$audience: AudienceEnum = ALL_AUDIENCE
$mediaType: MediaTypeEnum
$sortField: String = "_score"
$sortOption: SortOptionsEnum = DESC
$limit: Int = 10
$offset: Int = 10
) {
search(
  q: $q
  language: $language
  audience: $audience
  mediaType: $mediaType
  sortField: $sortField
  sortOption: $sortOption
  limit: $limit
  offset: $offset
) {
  items {
    uuid
    title
    description
    path
    lastModified
    score
    url
    author
    template
    tags
    image
    publishedDate
    readTime
    category
    video
    text
  }
  count
}
}`;

export const searchFilters = [
  {
    title: 'Audiences',
    key: 'audience',
    facets: [
      {
        selected: false,
        title: 'Employer',
        value: 'employer',
      },
      {
        selected: false,
        title: 'Individual & Family',
        value: 'indfam',
      },
      {
        selected: false,
        title: 'Medicare',
        value: 'medicare',
      },
      {
        selected: false,
        title: 'Producer',
        value: 'producer',
      },
      {
        selected: false,
        title: 'Provider',
        value: 'provider',
      },
    ],
  },
  {
    title: 'Media',
    key: 'media',
    facets: [
      {
        selected: false,
        title: 'Articles',
        value: 'articles',
      },
      {
        selected: false,
        title: 'Documents',
        value: 'documents',
      },
      {
        selected: false,
        title: 'Podcasts',
        value: 'podcasts',
      },
      {
        selected: false,
        title: 'Video',
        value: 'video',
      },
    ],
  },
];