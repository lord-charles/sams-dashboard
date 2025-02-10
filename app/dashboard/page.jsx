import dynamic from 'next/dynamic';

const Home = dynamic(() => import('./home/home'), { ssr: false });

const Page = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default Page;
