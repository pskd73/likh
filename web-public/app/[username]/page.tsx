import { BasePage, Footer, Paper } from "@/components/Layout";
import { Note } from "@/components/Note";
import { Courier } from "@/components/font";
import classNames from "classnames";
import moment from "moment";
import { Metadata } from "next";

type PublicUser = { user: { email: string }; notes: Note[] };

async function fetchPulicUser(username: string): Promise<PublicUser> {
  const res = await fetch(
    `${process.env.API_HOST}/public/user?username=${username}`,
    { next: { revalidate: 10 } }
  );
  return await res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  try {
    const title = `@${params.username}'s notes - Retro Note`;
    return {
      title,
      openGraph: {
        title,
        type: "article",
      },
      twitter: {
        title,
        card: "summary_large_image",
      },
    };
  } catch {}
  return {
    title: "Retro Note",
  };
}

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  let publicUser: PublicUser | undefined = undefined;

  try {
    publicUser = await fetchPulicUser(params.username);
  } catch {}

  return (
    <BasePage>
      <Paper>
        {!publicUser && (
          <div className="text-center py-10 text-3xl">Page not found!</div>
        )}
        {publicUser && (
          <div>
            <h1 className="text-4xl font-bold mb-10">@{params.username}</h1>
            <h2 className="text-3xl mb-6">My notes</h2>
            <ul className="space-y-8 mb-10">
              {publicUser.notes.map((note, i) => (
                <li
                  key={i}
                  className="border-l-4 border-primary-700 border-opacity-30 pl-6 hover:border-opacity-50"
                >
                  <a href={`/note/${note.id}`} className="hover:underline">
                    <h3
                      className={classNames(
                        Courier.className,
                        "text-lg italic"
                      )}
                    >
                      {note.plain_title}
                    </h3>
                  </a>
                  <span className="text-sm opacity-50">
                    Written {moment(new Date(note.created_at)).fromNow()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Footer />
      </Paper>
    </BasePage>
  );
}
