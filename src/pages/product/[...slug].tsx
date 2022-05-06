import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { StoryData } from 'storyblok-js-client';
import { GET_ALL_OPTIONS, GET_OPTIONS_BY_PRODUCT, GET_PRODUCT_BY_ID } from '../../graphQL/products';
import { GET_FOOTER } from '../../graphQL/pages';
import { initialiseApollo, addApolloState } from '../../lib/apolloClient';
import { Footer, OptionItem, ProductItem } from '../../interfaces/stories';
import { getObjectPosition } from '../../utils/utils';
import Layout from '../../layouts';

interface Props {
  options: OptionItem[];
  product: ProductItem;
  footer: StoryData;
}

const ProductDetailPage: NextPage<Props> = ({ options = [], product, footer }) => {
  const { query } = useRouter();

  const [option, setOption] = useState<OptionItem | null>(null);

  useEffect(() => {
    if (options?.length) {
      const selectedOption = options.find((option: OptionItem) => option.uuid === query?.slug?.[2]) || null;
      setOption(selectedOption);
    }
  }, [options, query.slug]);

  if (!option || !product) {
    return null;
  }
  const { mainImage, secondaryImages } = option.content;

  return (
    <Layout footer={footer.content as Footer} pageType="shop">
      <Image
        // className={styles.shopPage_image}
        src={`${mainImage.filename}/m/`}
        alt={mainImage.alt}
        layout="fill"
        objectPosition={getObjectPosition(mainImage)}
        priority
      />
      <div>
        <h3>{product.name}</h3>
        <p>{product.content.subtitle}</p>
        <p>{product.content.description}</p>
        <p>{product.content.dimensions}</p>
        <p>Handmade in Hilversum, The Netherlands</p>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initialiseApollo();

  const {
    data: { OptionItems }
  } = await apolloClient.query({
    query: GET_ALL_OPTIONS
  });

  const paths = OptionItems.items.map((option: OptionItem) => ({
    params: { slug: ['product', option.slug, option.content.product.uuid, option.uuid] }
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initialiseApollo();
  const { slug } = params || {};

  const { data } = await apolloClient.query({
    query: GET_FOOTER
  });

  const {
    data: { OptionItems }
  } = await apolloClient.query({
    query: GET_OPTIONS_BY_PRODUCT,
    variables: {
      productId: slug?.[1]
    }
  });

  const {
    data: { ProductItem }
  } = await apolloClient.query({
    query: GET_PRODUCT_BY_ID,
    variables: {
      productId: slug?.[1]
    }
  });

  return addApolloState(apolloClient, {
    props: {
      options: OptionItems.items,
      product: ProductItem,
      footer: data.FooterItem
    }
  });
};
