import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { StoryData } from 'storyblok-js-client';
import SbEditable from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../../lib/apolloClient';
import { useLazyQuery } from '@apollo/client';
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

const ProductPage: NextPage<Props> = ({ story, preview, footer, pageType, options, filters }) => {
  const router = useRouter();
  const { query } = router;

  const mounted = useRef(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, string[]>>({ category: [], collection: [] });
  const [products, setProducts] = useState([]);
  const [optionList, setOptions] = useState(options.items);

  const [fetchOptions] = useLazyQuery(GET_OPTIONS_BY_PAGE, {
    ssr: false,
    // Had to be network only as onCompleted doesnt trigger if data is fetched from cache
    fetchPolicy: 'network-only',
    variables: {
      page,
      products: products.toString() || undefined,
      collection: selected.collection.toString() || undefined
    },
    onCompleted: (data) => {
      setOptions(data.OptionItems.items);
    }
  });

  const [fetchProductsByCategory] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { category: selected.category.toString() },
    // Had to be network only as onCompleted doesnt trigger if data is fetched from cache
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const productIds = data?.ProductItems.items.map((item: { uuid: string }) => item.uuid);
      if (!productIds.length) {
        setProducts([]);
        setOptions([]);
      } else {
        setProducts(productIds);
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'all') {
      return setSelected({ ...selected, [e.target.name]: [] });
    }

    if (e.target.checked) {
      return setSelected({ ...selected, [e.target.name]: [...selected[e.target.name], e.target.value] });
    } else {
      return setSelected({
        ...selected,
        [e.target.name]: selected[e.target.name].filter((item) => item !== e.target.value)
      });
    }
  };

  // only initialize the visual editor if we're in preview mode
  const { liveStory, liveFooter } = useStoryblok(preview, story, footer);

  const { bannerImage, title, subtitle } = liveStory.content || {};

  // To stop queries running on initial mount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      if (selected.category.length) {
        fetchProductsByCategory();
      } else {
        setProducts([]);
      }
      fetchOptions();
    }
  }, [selected]);

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
        {!query.slug &&
          Object.keys(filters).map((filter) => (
            <Filters
              key={filter}
              type={filter}
              options={filters[filter].items}
              onChange={handleChange}
              selected={selected}
            />
          ))}
        <div className={styles.shopPage_productList}>
          {!optionList?.length ? (
            <p>There are no products available</p>
          ) : (
            optionList.map((option) => {
              return <ProductCard key={option.uuid} {...option} />;
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
