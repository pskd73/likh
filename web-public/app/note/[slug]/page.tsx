import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Courier_Prime } from "next/font/google";
import classNames from "classnames";
import { Metadata } from "next";
import { Courier } from "@/components/font";

export type Note = {
  id: string;
  title: string;
  text: string;
  created_at: number;
  visibility: "private" | "public";
  slate_value?: string;
};

type PublicNote = { note: Note; user: { email: string } };

async function fetchNote(noteId: string): Promise<PublicNote> {
  const res = await fetch(
    `${process.env.API_HOST}/public/note?note_id=${noteId}`
  );
  return await res.json();
}

const getNoteTitle = (note: Note) => {
  if (note.title) {
    return note.title;
  }
  if (note.text) {
    let cleaned = note.text;
    const titleMatch = cleaned.match(/^\n*#{1,3} (.*)\n*.*/);
    if (titleMatch) {
      return titleMatch[1];
    }
    return (
      cleaned.replaceAll("\n", " ").substring(0, 50) +
      (cleaned.length > 50 ? "..." : "")
    );
  }
  return note.title;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const OG_IMG_URL =
    "https://gfbrmxfdddmpwlqtvwsh.supabase.co/storage/v1/object/sign/public/Read%20it%20on%20Retro%20Note-min.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMvUmVhZCBpdCBvbiBSZXRybyBOb3RlLW1pbi5wbmciLCJpYXQiOjE2ODQwMzcxOTcsImV4cCI6MTcxNTU3MzE5N30.5jA5GmDGs-XdzJL4TM17GkdPvw08jLxhFccz5Ahpux4&t=2023-05-14T04%3A06%3A40.249Z";
  try {
    const publicNote = await fetchNote(params.slug);
    const title = `${getNoteTitle(publicNote.note)} - Retro Note`;
    return {
      title,
      openGraph: {
        title,
        type: "article",
        images: OG_IMG_URL,
      },
      twitter: {
        title,
        card: "summary_large_image",
        images: OG_IMG_URL,
      },
    };
  } catch {}
  return {
    title: "Retro Note",
  };
}

export default async function Note({ params }: { params: { slug: string } }) {
  let publicNote: PublicNote | undefined = undefined;

  try {
    publicNote = await fetchNote(params.slug);
  } catch {}

  return (
    <main className="bg-base text-primary-700">
      <div className="flex justify-center">
        <div className="w-full max-w-[860px] py-10 px-6 md:px-0">
          <div className={classNames(Courier.className, "space-y-10")}>
            <article className="prose max-w-none lg:prose-xl prose-headings:mb-0 prose-li:my-0 prose-ol:my-6 min-h-[60vh]">
              {publicNote && (
                <>
                  <div className="mb-4">
                    {!publicNote.note.slate_value && (
                      <h1 className="text-4xl">{publicNote.note.title}</h1>
                    )}
                    <span className="opacity-50">
                      By {publicNote.user.email} @{" "}
                      {new Date(publicNote.note.created_at).toDateString()}
                    </span>
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {publicNote.note.text}
                  </ReactMarkdown>
                </>
              )}
              {!publicNote && (
                <div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {
                      "### Note does not exist!\n [Start writing here &rarr;](https://retronote.app)"
                    }
                  </ReactMarkdown>
                </div>
              )}
            </article>
            <footer>
              <div className="text-center opacity-50">•••</div>
              <div className="text-center">
                <a
                  href="https://retronote.app"
                  className="opacity-50 hover:opacity-100 hover:underline"
                >
                  Retro Note
                </a>
                <span className="opacity-50">
                  &nbsp;•&nbsp;Built with &lt;3 by&nbsp;
                </span>
                <a
                  className="opacity-50 hover:opacity-100 hover:underline"
                  href="https://twitter.com/@pramodk73"
                  target="_blank"
                  rel="noreferrer"
                >
                  @pramodk73
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
