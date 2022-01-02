import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { StoryData } from 'storyblok-js-client';
import SbEditable from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../../lib/apolloClient';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useStoryblok } from '../../lib/storyblok';
import Layout from '../../layouts/index';
import ProductCard from '../../components/product-card';
import Filters from '../../components/filter';
import { CategoryCollection, OptionItem, ProductPage } from '../../interfaces/stories';
import { GET_PRODUCT_PAGE } from '../../graphQL/pages';
import { GET_OPTIONS_BY_PAGE, GET_PRODUCTS_BY_CATEGORY } from '../../graphQL/products';
import { GET_ALL_CATEGORIES, GET_ALL_COLLECTIONS } from '../../graphQL/categories';
import { getObjectPosition } from '../../utils/utils';

import styles from './shopPage.module.scss';
import { useRouter } from 'next/router';

interface FetchArgs {
  products: string;
  collection: string;
  page: number;
}
interface Props {
  story: StoryData;
  preview: boolean;
  options: { items: OptionItem[] };
  footer: StoryData;
  pageType: string;
  filters: Record<string, { items: CategoryCollection[] }>;
  fetchArgs: FetchArgs;
}

const ProductPage: NextPage<Props> = ({ story, preview, footer, pageType, options, filters, fetchArgs }) => {
  const [fetchArguments, setFetchArgs] = useState(fetchArgs);
  const [products, setProducts] = useState(options);

  const { data, loading, refetch } = useQuery(GET_OPTIONS_BY_PAGE, {
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      ...fetchArguments,
      collection: fetchArguments?.collection?.toString() || undefined,
      products: fetchArguments?.products?.toString() || undefined
    },
    onCompleted: (data) => setProducts(data?.OptionItems)
  });

  const router = useRouter();
  const { query } = router;

  // only initialize the visual editor if we're in preview mode
  const { liveStory, liveFooter } = useStoryblok(preview, story, footer);

  const { bannerImage, title, subtitle } = liveStory.content || {};

  useEffect(() => {
    refetch();
    console.log('useEffect in page', fetchArguments, data);
  }, [fetchArguments]);

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
      <Layout footer={liveFooter?.content} pageType={pageType}>
        <SbEditable content={{ ...liveStory.content, _editable: liveStory.content._editable || undefined }}>
          <div>
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
        {!query.slug && <Filters filters={filters} fetchArgs={fetchArguments} setFetchArgs={setFetchArgs} />}
        {loading ? (
          <div>Loading</div>
        ) : (
          <div className={styles.shopPage_productList}>
            {!products?.items?.length ? (
              <p>There are no products available</p>
            ) : (
              products.items.map((option) => {
                return <ProductCard key={option.uuid} {...option} />;
              })
            )}
          </div>
        )}
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
