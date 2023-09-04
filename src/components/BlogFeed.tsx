export async function BlogFeed() {
  const { allDocs } = await import("contentlayer/generated");

  return (
    <section>
      <h1>Blog</h1>

      <ol>
        {allDocs.map((doc) => (
          <li key={doc.slug}>
            <a href={`${doc.slug}`}>{doc.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
