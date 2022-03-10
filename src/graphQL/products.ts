import { gql } from '@apollo/client';

export const CORE_OPTION_FIELDS = gql`
  fragment coreOptionFields on OptionItems {
    total
    items {
      slug
      uuid
      content {
        _editable
        _uid
        component
        discountPercentage
        hidden
        priceSupplement
        product {
          content
          name
        }
        colour {
          name
        }
        mainImage {
          alt
          filename
          focus
        }
        secondaryImages {
          alt
          filename
          focus
        }
        collection {
          name
        }
      }
    }
  }
`;

export const GET_OPTIONS_BY_PAGE = gql`
  ${CORE_OPTION_FIELDS}
  query getAllOptionsByPage($page: Int!, $collection: String, $products: String) {
    OptionItems(
      filter_query_v2: { hidden: { in: "false" }, collection: { in: $collection }, product: { in: $products } }
      page: $page
      per_page: 10
    ) {
      ...coreOptionFields
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query getProductsByCategory($category: String) {
    ProductItems(filter_query_v2: { category: { in: $category } }) {
      items {
        uuid
      }
    }
  }
`;
