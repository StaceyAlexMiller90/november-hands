import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { useApollo } from '../lib/apolloClient';
// import AppLayout from '../layouts';

import '../styles/main.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const client = useApollo(pageProps);

  return (
    <ApolloProvider client={client}>
      {/* <AppLayout> */}
      <Component {...pageProps} />
      {/* </AppLayout> */}
    </ApolloProvider>
  );
}

export default MyApp;
