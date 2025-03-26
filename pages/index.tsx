import GoogleDocDisplay from '../components/GoogleDocDisplay';

export default function Home() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Latest Updates</h2>
      <GoogleDocDisplay />
    </section>
  );
} 