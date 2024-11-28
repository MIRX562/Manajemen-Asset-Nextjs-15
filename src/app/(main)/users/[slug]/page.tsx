// import { notFound } from "next/navigation"; // For handling invalid slugs

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // Fetch data from the database or any source using the slug

  // Handle slug not found
  //   if (!data) {
  //     notFound(); // Automatically renders the Next.js 404 page
  //   }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <p>{slug}</p>
    </div>
  );
}
