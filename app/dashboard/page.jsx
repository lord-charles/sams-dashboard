import dynamic from 'next/dynamic';
import Loading from './loading';

const HomeDataClient = dynamic(
  () => import('./home/home-data-client'),
  {
    ssr: false,
    loading: () => <Loading />
  }
);

export default function Page() {
  return <HomeDataClient />;
}
