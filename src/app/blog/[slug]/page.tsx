import { Mdx } from "@/components/Mdx";
import { allDocs } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

async function getDocFromParams(slug: string) {
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) notFound();

  return doc;
}

const page: FC<pageProps> = async ({ params }) => {
  const doc = await getDocFromParams(params.slug);

  return (
    <section className={"p-4"}>
      <Link href={"/"}>Back to blog</Link>
      <h1 className={"text-2xl font-bold mb-2"}>{doc.title}</h1>
      <p>{doc.description}</p>

      <hr />
      <br />
      <Mdx code={doc.body.code} />
    </section>
  );
};

export default page;
