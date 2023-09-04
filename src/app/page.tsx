import { BlogFeed } from "@/components/BlogFeed";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<p>Loading...</p>}>
        <BlogFeed />
      </Suspense>
    </main>
  );
}
