import Head from 'next/head';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { StoryData } from 'storyblok-js-client';
import { SbEditableContent } from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../lib/apolloClient';
import DynamicComponent from '../components/dynamic-component';
import { useStoryblok } from '../lib/storyblok';
import { GET_PAGE_BY_SLUG, GET_PAGE_SLUGS } from '../graphQL/pages';
import Layout from '../layouts/index';
import { Footer } from '../interfaces/stories';

interface Props {
  story: StoryData;
  preview: boolean;
  footer: StoryData;
  pageType: string;
}

const Page: NextPage<Props> = ({ story, preview, footer, pageType }) => {
  // only initialize the visual editor if we're in preview mode
  const { liveStory, liveFooter } = useStoryblok(preview, story, footer);
  const bodyComponents = liveStory?.content?.body?.map((blok: SbEditableContent, index: number) => {
    return <DynamicComponent blok={blok} key={blok._uid} position={index} />;
  });

  return (
    <>
      <Head>
        <title>November Hands - Hand Crafted Ceramics</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout intro={liveStory?.content?.intro?.[0]} footer={liveFooter?.content as Footer} pageType={pageType}>
        {bodyComponents}
      </Layout>
    </>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initialiseApollo();
  const {
    data: { PageItems }
  } = await apolloClient.query({
    query: GET_PAGE_SLUGS
  });

  const paths = PageItems?.items.map((item: { slug: string }) => {
    return {
      params: { slug: item.slug === 'home' ? null : [`/${item.slug}`] }
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ preview = false, params }) => {
  const apolloClient = initialiseApollo(preview);

  const { data } = await apolloClient.query({
    query: GET_PAGE_BY_SLUG,
    variables: { slug: params?.slug?.[0] || 'home' }
  });

  return addApolloState(apolloClient, {
    props: {
      story: data.PageItem || null,
      preview,
      footer: data.FooterItem || null,
      pageType: params?.slug?.[0] || 'home'
    }
  });
};
