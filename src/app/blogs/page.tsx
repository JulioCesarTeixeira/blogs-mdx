import { BlogFeed } from "@/components/BlogFeed";
import Link from "next/link";
import { Suspense } from "react";

export default function Blogs() {
  return (
    <main className="flex min-h-screen flex-col items-start p-24 gap-4">
      <Link href="/">Home</Link>
      <Suspense fallback={<p>Loading...</p>}>
        <BlogFeed />
      </Suspense>
    </main>
  );
}
