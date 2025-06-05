let suggestionURL="https://nwzqv94hr0.execute-api.us-east-1.amazonaws.com/dev/v1/search",suggestionQuery=`query Suggest($term: String!, $language: LanguageEnum = EN, $limit: Int = 5, $audience: AudienceEnum = ALL_AUDIENCE) {
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
}`,searchURL="https://apigw-sit.wellmark.com/wellmark-com-open-search/v1/search",searchQuery=`query Search(
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
}`,searchFilters=[{title:"Audiences",key:"audience",facets:[{selected:!1,title:"Employer",value:"employer"},{selected:!1,title:"Individual & Family",value:"indfam"},{selected:!1,title:"Medicare",value:"medicare"},{selected:!1,title:"Producer",value:"producer"},{selected:!1,title:"Provider",value:"provider"}]},{title:"Media",key:"media",facets:[{selected:!1,title:"Articles",value:"articles"},{selected:!1,title:"Documents",value:"documents"},{selected:!1,title:"Podcasts",value:"podcasts"},{selected:!1,title:"Video",value:"video"}]}];export{suggestionURL,suggestionQuery,searchURL,searchQuery,searchFilters};