import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { StoryData } from 'storyblok-js-client';
import { SbEditableContent } from 'storyblok-react';
import { initialiseApollo, addApolloState } from '../lib/apolloClient';
import Header from '../components/header/Header';
import DynamicComponent from '../components/dynamic-component/DynamicComponent';
import { useStoryblok } from '../lib/storyblok';
import { GET_PAGE_BY_SLUG } from '../graphQL/pages';

import styles from './Home.module.scss';

interface Props {
  story: StoryData;
  preview: boolean;
}

const Home: NextPage<Props> = ({ story, preview }) => {
  // only initialize the visual editor if we're in preview mode
  const liveStory = useStoryblok(story, preview);
  const components = liveStory.content.body.map((blok: SbEditableContent) => {
    return <DynamicComponent blok={blok} key={blok._uid} />;
  });

  return (
    <>
      <Head>
        <title>November Hands - Hand Crafted Ceramics</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div></div>
      </Header>
      {components}
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const apolloClient = initialiseApollo(preview);

  const { data } = await apolloClient.query({
    query: GET_PAGE_BY_SLUG,
    variables: { slug: 'home' }
  });

  return addApolloState(apolloClient, {
    props: {
      story: data?.PageItem || null,
      preview
    }
  });
};
