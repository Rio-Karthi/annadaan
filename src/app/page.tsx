import { auth } from '@clerk/nextjs/server';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Hero isLoggedIn={!!userId} />
      <Features />
    </main>
  );
}
