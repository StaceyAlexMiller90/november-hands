import { useMemo } from 'react';
import { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

// Types
import type { NormalizedCacheObject, StoreObject } from '@apollo/client';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

interface ApolloState {
  [APOLLO_STATE_PROP_NAME]?: StoreObject;
}

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = (preview?: boolean): ApolloClient<NormalizedCacheObject> => {
  const httpLink = new HttpLink({
    uri: 'https://gapi.storyblok.com/v1/api',
    headers: {
      token: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET,
      version: preview ? 'draft' : 'published'
    }
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache(),
    credentials: 'include'
  });
};

export const initialiseApollo = (
  preview?: boolean,
  initialState?: AppProps['pageProps']
): ApolloClient<NormalizedCacheObject> => {
  // eslint-disable-next-line
  const _apolloClient = apolloClient || createApolloClient(preview)

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return apolloClient;
};

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: Record<string, unknown> }
): { props: Record<string, unknown> } {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: ApolloState, preview?: boolean): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initialiseApollo(preview, state), [preview, state]);
  return store;
}
