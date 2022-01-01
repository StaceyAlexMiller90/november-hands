import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query getAllCategories {
    CategoryItems {
      items {
        uuid
        name
        slug
      }
    }
  }
`;

export const GET_ALL_COLLECTIONS = gql`
  query getAllCollections {
    CollectionItems {
      items {
        uuid
        name
        slug
      }
    }
  }
`;
