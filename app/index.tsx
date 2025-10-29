
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    console.log('Index screen mounted - redirecting to main-menu');
  }, []);

  return <Redirect href="/main-menu" />;
}
