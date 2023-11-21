import { sha256 } from 'js-sha256';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  APP_CLIENT_URL,
  APP_SERVER_URL,
  SHOPIFY_CLIENT_ID,
  SHOPIFY_CLIENT_SECRET,
  SHOPIFY_SCOPES,
} from './constants';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const searchParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  console.log('searchParams', searchParams);
  // validate shop url
  const isValidShop = useMemo(() => {
    return /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/.test(searchParams.shop);
  }, [searchParams.shop]);

  // validate hmac
  const { hmac, ...restParams } = searchParams;
  const isValidHmac = useMemo(() => {
    if (hmac === undefined) return <h2>Not valid</h2>;

    const queryString = new URLSearchParams(restParams).toString();
    const newHmac = sha256.hmac(SHOPIFY_CLIENT_SECRET, queryString);

    return newHmac === hmac;
  }, [hmac, restParams]);

  const authenticate = useCallback(() => {
    (async () => {
      const response = await fetch(`${APP_SERVER_URL}/auth/check-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shop: searchParams.shop }),
      });

      const { isAuthenticated, accessToken } = await response.json();

      if (isAuthenticated && accessToken) {
        localStorage.setItem('access-token', accessToken);
        setIsAuthenticated(true);

        return;
      }

      const redirect_uri = `${APP_CLIENT_URL}/authenticate`;
      const state = Date.now();
      const authorizationUrl = `https://${searchParams.shop}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scopes=${SHOPIFY_SCOPES}&redirect_uri=${redirect_uri}&state=${state}`;
      localStorage.setItem('state', state);
      window.location.replace(authorizationUrl);
    })();
  }, [searchParams.shop]);

  useEffect(() => {
    if (!isValidHmac || !isValidShop) return;

    authenticate();
  }, [authenticate, isValidHmac, isValidShop]);

  if (!isValidShop) return <h2>Not valid shop url</h2>;
  if (!isValidHmac) return <h2>not valid</h2>;

  if (!isAuthenticated) return <h1>Loading...</h1>;

  return <div>Home</div>;
};

export default Home;
