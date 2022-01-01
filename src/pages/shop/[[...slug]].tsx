import Head from 'next/head';
import Image from 'next/image';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { StoryData } from 'storyblok-js-client';
import SbEditable from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../../lib/apolloClient';
import { useStoryblok } from '../../lib/storyblok';
import Layout from '../../layouts/index';
import ProductCard from '../../components/product-card';
import { GET_PRODUCT_PAGE } from '../../graphQL/pages';
import { GET_OPTIONS_BY_PAGE, GET_PRODUCTS_BY_CATEGORY } from '../../graphQL/products';
import { getObjectPosition } from '../../utils/utils';

import styles from './shopPage.module.scss';
import { GET_ALL_CATEGORIES, GET_ALL_COLLECTIONS } from '../../graphQL/categories';

interface Props {
  story: StoryData;
  preview: boolean;
  options: { items: StoryData[] };
  footer: StoryData;
  pageType: string;
  filter?: string[];
}

const ProductPage: NextPage<Props> = ({ story, preview, footer, pageType, options, filter }) => {
  console.log(options);
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
      <Layout footer={liveFooter?.content} pageType={pageType}>
        <SbEditable content={{ ...liveStory.content, _editable: liveStory.content._editable || undefined }}>
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
        </SbEditable>
        <div className={styles.shopPage_productList}>
          {!options?.items?.length ? (
            <p>There are no products available right now</p>
          ) : (
            options.items.map(({ content, slug }) => {
              const { _uid, colour, product, mainImage, secondaryImages, priceSupplement, discountPercentage } = content;
              return (
                <ProductCard
                  key={_uid}
                  colour={colour}
                  product={product}
                  mainImage={mainImage}
                  secondaryImages={secondaryImages}
                  priceSupplement={priceSupplement}
                  discountPercentage={discountPercentage}
                  slug={slug}
                />
              );
            })
          )}
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

  const categoryPaths = CategoryItems.items.map((category) => {
    return { params: { slug: ['category', category.slug, category.uuid] } };
  });

  const {
    data: { CollectionItems }
  } = await apolloClient.query({
    query: GET_ALL_COLLECTIONS
  });

  const collectionPaths = CollectionItems.items.map((collection) => {
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

  if (slug?.[0] === 'category') {
    const {
      data: { ProductItems }
    } = await apolloClient.query({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { category: slug[2] }
    });

    filters = { products: ProductItems?.items.map((item) => item.uuid).toString() };
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
      pageType: 'shop'
    }
  });
};
