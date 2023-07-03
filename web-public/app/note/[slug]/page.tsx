import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Event from "@/components/Event";
import classNames from "classnames";
import { Metadata } from "next";
import { Courier, PTSerif, getUserBlogFont } from "@/components/font";
import { Note } from "@/components/Note";
import { BasePage, Footer, Paper } from "@/components/Layout";
import moment from "moment";

type PublicNote = { note: Note; user: User };

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
  try {
    const publicNote = await fetchNote(params.slug);
    const title = `${getNoteTitle(publicNote.note)} - Retro Note`;

    const author = publicNote.user.username
      ? `@${publicNote.user.username}`
      : publicNote.user.email;

    const OG_IMG_URL = `https://retronote.app/og?title=${publicNote.note.plain_title}&author=${author}`;

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

  const author = publicNote?.user.username
    ? "@" + publicNote.user.username
    : publicNote?.user.email;

  return (
    <BasePage>
      <Event name="public_note" props={{ note_id: params.slug }} />
      <Paper>
        <div className={classNames("space-y-10")}>
          <article className="prose max-w-none lg:prose-xl prose-li:my-0 prose-ol:my-6 min-h-[60vh]">
            {publicNote && (
              <>
                <div className="mb-4">
                  {!publicNote.note.slate_value && (
                    <h1 className="text-4xl">{publicNote.note.title}</h1>
                  )}
                  <span className="opacity-50">
                    Written by {author},{" "}
                    {moment(new Date(publicNote.note.created_at)).fromNow()}
                  </span>
                </div>
                <div className={getUserBlogFont(publicNote.user).className}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img({ node, className, children, ...props }) {
                        return (
                          <span className="flex justify-center">
                            <img
                              {...props}
                              className={className + " text-center"}
                            />
                          </span>
                        );
                      },
                      code({ node, className, children, ...props }) {
                        return (
                          <code
                            {...props}
                            className={className + " text-white"}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {publicNote.note.text}
                  </ReactMarkdown>
                </div>
                {publicNote.user.username && (
                  <div className="text-center py-10">
                    <a
                      href={`/${publicNote.user.username}`}
                      className="hover:underline opacity-50 hover:opacity-100"
                    >
                      &larr; Read my other notes
                    </a>
                  </div>
                )}
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
          <Footer />
        </div>
      </Paper>
    </BasePage>
  );
}
