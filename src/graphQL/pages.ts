import { gql } from '@apollo/client';

export const GET_PAGE_BY_SLUG = gql`
  query getPageBySlug($slug: ID!) {
    PageItem(id: $slug) {
      id
      content {
        _editable
        _uid
        body
        component
      }
    }
  }
`;
