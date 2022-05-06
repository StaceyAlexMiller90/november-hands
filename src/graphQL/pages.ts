import { gql } from '@apollo/client';

export const CORE_FOOTER_FIELDS = gql`
  fragment coreFooterFields on FooterItem {
    content {
      _editable
      _uid
      component
      copywright
      darkOverlay
      image {
        alt
        filename
        focus
      }
      activeLinks {
        slug
        name
      }
      socials {
        content
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  ${CORE_FOOTER_FIELDS}
  query getPageBySlug($slug: ID!) {
    PageItem(id: $slug) {
      id
      content {
        _editable
        _uid
        intro
        body
        component
      }
    }
    FooterItem(id: "footer") {
      ...coreFooterFields
    }
  }
`;

export const GET_PAGE_SLUGS = gql`
  query getAllPageSlugs {
    PageItems {
      items {
        slug
      }
    }
  }
`;

export const GET_PRODUCT_PAGE = gql`
  ${CORE_FOOTER_FIELDS}
  query getProductPage {
    ProductpageItem(id: "shop") {
      content {
        _editable
        _uid
        component
        subtitle
        title
        bannerImage {
          alt
          focus
          filename
        }
      }
    }
    FooterItem(id: "footer") {
      ...coreFooterFields
    }
  }
`;

export const GET_FOOTER = gql`
  ${CORE_FOOTER_FIELDS}
  query getFooter {
    FooterItem(id: "905b09f0-124b-42c4-b54f-c649f74a5d34", find_by: "uuid") {
      ...coreFooterFields
    }
  }
`;
