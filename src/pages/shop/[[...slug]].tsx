import React, { useEffect, useState, useRef, useCallback, SetStateAction, Dispatch } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { StoryData } from 'storyblok-js-client';
import SbEditable from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../../lib/apolloClient';
import { useApolloClient } from '@apollo/client';
import { useStoryblok } from '../../lib/storyblok';
import Layout from '../../layouts/index';
import ProductCard from '../../components/product-card';
import Filters from '../../components/filters';
import Logo from '../../components/logo';
import { CategoryCollection, Footer, OptionItem, ProductPage } from '../../interfaces/stories';
import { GET_PRODUCT_PAGE } from '../../graphQL/pages';
import { GET_OPTIONS_BY_PAGE, GET_PRODUCTS_BY_CATEGORY } from '../../graphQL/products';
import { GET_ALL_CATEGORIES, GET_ALL_COLLECTIONS } from '../../graphQL/categories';
import { getObjectPosition } from '../../utils/utils';

import styles from './ShopPage.module.scss';

interface FetchArgs {
  products: string;
  collection: string;
  page: number;
}
interface Props {
  story: StoryData;
  preview: boolean;
  options: { total: number; items: OptionItem[] };
  footer: StoryData;
  pageType: string;
  filters: Record<string, { items: CategoryCollection[] }>;
  fetchArgs: FetchArgs;
}

const ProductPage: NextPage<Props> = ({ story, preview, footer, pageType, options, filters }) => {
  const router = useRouter();
  const client = useApolloClient();
  const { query } = router;
  const mounted = useRef(false);
  const { total } = options;
  const page = useRef(1);
  const [products, setProducts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [optionList, setOptions] = useState<OptionItem[]>(options.items);
  const [hasMore, setHasMore] = useState(options.items.length < total);

  const fetchOptions = useCallback(
    async (variables = {}, fetchMore?: boolean) => {
      const { data } = await client.query({
        query: GET_OPTIONS_BY_PAGE,
        variables: {
          page: page.current,
          products: products.toString() || undefined,
          collection: collections.toString() || undefined,
          ...variables
        }
      });
      setOptions((prevState) => (fetchMore ? [...prevState, ...data.OptionItems.items] : data.OptionItems.items));
      setHasMore(data.OptionItems.items.length < data.OptionItems.total);
    },
    [client, collections, products]
  );

  const fetchProducts = useCallback(
    async (category: string[]) => {
      const { data } = await client.query({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: {
          category: category.toString() || undefined
        }
      });
      const productIds = data.ProductItems.items.map((item: { uuid: string }) => item.uuid);
      if (!productIds.length) {
        setProducts([]);
        setOptions([]);
      } else {
        setProducts(productIds.toString());
        fetchOptions({
          products: productIds.toString() || undefined
        });
      }
    },
    [client, fetchOptions]
  );

  const observer = useRef<IntersectionObserver>();
  const lastEl = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          page.current += 1;
          fetchOptions(undefined, true);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, fetchOptions]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setStateMethod: Dispatch<SetStateAction<string[]>>) => {
    if (e.target.value === 'all') {
      setStateMethod([]);
    } else if (e.target.checked) {
      setStateMethod((prevState) => [...prevState, e.target.value]);
    } else {
      setStateMethod((prevState) => prevState.filter((item) => item !== e.target.value));
    }
  };

  useEffect(() => {
    if (mounted.current) {
      page.current = 1;
      if (categories.length) {
        fetchProducts(categories);
      } else {
        setProducts([]);
        fetchOptions({
          products: undefined
        });
      }
    }
  }, [categories, fetchOptions, fetchProducts]);

  useEffect(() => {
    if (mounted.current) {
      page.current = 1;
      fetchOptions({
        collection: collections.toString() || undefined
      });
    }
  }, [collections, fetchOptions]);

  // To stop queries running on initial mount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  // only initialize the visual editor if we're in preview mode
  const { liveStory, liveFooter } = useStoryblok(preview, story, footer);

  const { bannerImage, title, subtitle } = liveStory.content || {};

  if (!bannerImage?.filename || !title) {
    return null;
  }

  return (
    <>
      <Head>
        <title>November Hands - Hand Crafted Ceramics</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout footer={liveFooter?.content as Footer} pageType={pageType}>
        <SbEditable content={{ ...liveStory.content, _editable: liveStory.content._editable || undefined }}>
          <div className={styles.shopPage}>
            <div className={styles.shopPage_imageWrapper}>
              <Image
                className={styles.shopPage_image}
                src={`${bannerImage.filename}/m/`}
                alt={bannerImage.alt}
                layout="fill"
                objectPosition={getObjectPosition(bannerImage)}
                priority
              />
            </div>
            <h1 className={styles.shopPage_title}>{title}</h1>
            {subtitle && <h2 className={styles.shopPage_subtitle}>{subtitle}</h2>}
          </div>
        </SbEditable>
        {!query.slug && (
          <>
            <Filters
              type="category"
              options={filters.category.items}
              onChange={(e) => handleChange(e, setCategories)}
              selected={categories}
            />
            <Filters
              type="collection"
              options={filters.collection.items}
              onChange={(e) => handleChange(e, setCollections)}
              selected={collections}
            />
          </>
        )}
        <div className={styles.shopPage_productList}>
          {!optionList?.length ? (
            <p>There are no products available</p>
          ) : (
            optionList.map((option, i) => {
              const props = {
                ...option,
                ...(i === optionList.length - 1 && { ref: lastEl })
              };
              return <ProductCard key={option.uuid} {...props} />;
            })
          )}
          <Logo isWatermark />
        </div>
      </Layout>
    </>
  );
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initialiseApollo();

  const rootPath = { params: { slug: null } };

  const {
    data: { CategoryItems }
  } = await apolloClient.query({
    query: GET_ALL_CATEGORIES
  });

  const categoryPaths = CategoryItems.items.map((category: CategoryCollection) => {
    return { params: { slug: ['category', category.slug, category.uuid] } };
  });

  const {
    data: { CollectionItems }
  } = await apolloClient.query({
    query: GET_ALL_COLLECTIONS
  });

  const collectionPaths = CollectionItems.items.map((collection: CategoryCollection) => {
    return { params: { slug: ['collection', collection.slug, collection.uuid] } };
  });

  const paths = [rootPath, ...categoryPaths, ...collectionPaths];

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ preview = false, params }) => {
  const apolloClient = initialiseApollo(preview);
  const { slug } = params || {};

  let filters;

  const { data } = await apolloClient.query({
    query: GET_PRODUCT_PAGE
  });

  const {
    data: { CollectionItems }
  } = await apolloClient.query({
    query: GET_ALL_COLLECTIONS
  });

  const {
    data: { CategoryItems }
  } = await apolloClient.query({
    query: GET_ALL_CATEGORIES
  });

  if (slug?.[0] === 'category') {
    const {
      data: { ProductItems }
    } = await apolloClient.query({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { category: slug[2] }
    });

    filters = { products: ProductItems?.items.map((item: { uuid: string }) => item.uuid).toString() };
  } else {
    filters = slug && { [slug?.[0]]: slug?.[2] };
  }

  const {
    data: { OptionItems }
  } = await apolloClient.query({
    query: GET_OPTIONS_BY_PAGE,
    variables: {
      page: 1,
      ...filters
    }
  });

  return addApolloState(apolloClient, {
    props: {
      story: data.ProductpageItem,
      preview,
      slug: slug || null,
      options: OptionItems,
      footer: data.FooterItem,
      pageType: 'shop',
      fetchArgs: { page: 1, ...filters },
      filters: {
        category: CategoryItems,
        collection: CollectionItems
      }
    }
  });
};
