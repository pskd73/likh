import { Note } from "@/components/Note";
import { GetServerSideProps } from "next";

const HOST = "https://retronote.app";

function generateSiteMap(notes: Note[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://retronote.app</loc>
     </url>
     ${notes
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${HOST}/note/${id}`}</loc>
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
  const request = await fetch(`${process.env.API_HOST}/public/notes`);
  const json = await request.json();
  const sitemap = generateSiteMap(json.notes);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
