import { Note } from "@/components/Note";
import { GetServerSideProps } from "next";

const HOST = "https://retronote.app";

function generateSiteMap(notes: Note[], users: Array<{username: string}>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://retronote.app</loc>
     </url>

     ${users
      .map(({ username }) => {
        return `
      <url>
          <loc>${`${HOST}/${username}`}</loc>
      </url>
    `;
      })
      .join("")}

     ${notes
       .map(({ id, slug }) => {
         return `
       <url>
           <loc>${`${HOST}/note/${slug || id}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  return;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const request = await fetch(`${process.env.API_HOST}/public/notes`, {next: {revalidate: 5}});
  const json = await request.json();
  const sitemap = generateSiteMap(json.notes, json.users);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
