import { Editor } from "@/components/Editor";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <Link href="/blogs">Blogs</Link>

      <h1>My new blog post:</h1>
      <Editor />
    </main>
  );
}
