import ReactMarkdown from "react-markdown";
import { DownloadableNote } from "src/App/File";
import { SavedNote } from "src/App/type";
import ReactDOM from "react-dom/client";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { textToTitle } from "src/Note";
import JSZip from "jszip";

type Chapter = {
  id: string;
  title: string;
  images: Array<{ id: string; mimeType: string }>;
  url: string;
  content: string;
  number: number;
};

type Epub = {
  description: string;
  title: string;
  chapters: Chapter[];
  images: any;
  author: string;
  publisher: string;
};

function container() {
  return `<?xml version="1.0" encoding="UTF-8" ?>
  <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
      <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
  </container>`;
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
    return c;
  });
}

function content(epub: Epub) {
  const { description, title, author, publisher, chapters, images } = epub;
  const modified = new Date().toISOString().split(".")[0] + "Z";

  return `<?xml version="1.0" encoding="UTF-8"?>
<package
  xmlns="http://www.idpf.org/2007/opf"
  xmlns:opf="http://www.idpf.org/2007/opf"
  version="3.0"
  unique-identifier="BookId"
  >
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    ${/* @TODO figure out the ID stuff */ ""}
    <dc:identifier id="BookId">${Date.now()}</dc:identifier>
      <meta refines="#BookId" property="identifier-type" scheme="onix:codelist5">22</meta>
      <meta property="dcterms:identifier" id="meta-identifier">BookId</meta>
    
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:language>en</dc:language>
    ${
      description
        ? `<dc:description>${escapeXml(description)}</dc:description>`
        : ""
    }
    <dc:creator id="creator">${author}</dc:creator>
    <dc:publisher>${publisher}</dc:publisher>
    
    <meta name="generator" content="readlists.jim-nielsen.com" />    
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>

    <manifest>
      <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav" />
      <item id="chapter-image-placeholder" href="images/img-placeholder.jpg" media-type="image/jpeg" />
      
      ${chapters
        .map(
          (chapter) =>
            `<item
              id="chapter-${chapter.id}"
              href="${chapter.id}.xhtml"
              media-type="application/xhtml+xml"
            />` +
            chapter.images
              .map(
                ({ id, mimeType }) =>
                  `<item id="chapter-image-${id}" href="images/${id}" media-type="${mimeType}" />`
              )
              .join("\n")
        )
        .join("\n")}
    </manifest>
    <spine>
      <itemref idref="toc"/>
      ${chapters
        .map((chapter) => `<itemref idref="chapter-${chapter.id}" />`)
        .join("\n")}
    </spine>
    <guide>
      <reference title="Table of content" type="toc" href="toc.xhtml"/>
    </guide>
</package>
  `;
}

function toc(epub: Epub) {
  const { chapters } = epub;
  return `<?xml version='1.0' encoding='UTF-8'?>
    <html xmlns:epub="http://www.idpf.org/2007/ops" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>Table of Contents</title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <h1>Table of Contents</h1>
      <nav id="toc" epub:type="toc">
        <ol>
          ${chapters
            .map(
              (chapter) =>
                `<li id="chapter-${chapter.id}">
                  <a epub:type="bodymatter" href="${chapter.id}.xhtml">
                    ${escapeXml(chapter.title)}
                  </a>
                </li>`
            )
            .join("\n")}
        </ol>
      </nav>
    </body>
    </html>
  `;
}

function getChapter(chapter: Chapter, opts: { chapterLabel?: boolean }) {
  const { title, url, content, number } = chapter;
  return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
        blockquote {
          background: #f9f9f9;
          border-left: 10px solid #ccc;
          margin: 1.5em 10px;
          padding: 0.5em 10px;
          padding-top: 1.5em;
        }
        blockquote:before {
          color: #ccc;
          content: open-quote;
          font-size: 4em;
          line-height: 0.1em;
          margin-right: 0.25em;
          vertical-align: -0.4em;
        }
        blockquote p {
          margin-top: -4px;
        }
        </style>
      </head>
      <body>
        ${
          opts.chapterLabel
            ? `
        <div class="chapter-label">
          <h4>CHAPTER ${number}</h4>
        </div>
        `
            : ""
        }
        ${content}
      </body>
    </html>
  `;
}

const mdToHtml = (md: string): Promise<string> => {
  return new Promise((res) => {
    const div = document.createElement("div");
    const root = (ReactDOM as any).createRoot(div);
    const comp = (
      <ReactMarkdown
        children={md}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => (
            <p style={{ whiteSpace: "pre-wrap" }} {...props} />
          ),
          img: ({ node, ...props }) => (
            <div style={{ textAlign: "center" }}>
              <img {...props} />
            </div>
          ),
        }}
      />
    );
    root.render(comp);
    setTimeout(() => {
      let html = div.innerHTML;
      html = html.replace(/(<input[^>]*)(>)/g, "$1/>");
      html = html.replace(/(<br[^>]*)(>)/g, "$1/>");
      html = html.replace(/(<hr[^>]*)(>)/g, "$1/>");
      html = html.replace(/(<img[^>]*)(>)/g, "$1/>");
      html = html.replace(/(<link[^>]*)(>)/g, "$1/>");
      res(html);
    });
  });
};

const getByTitle = (title: string, notes: SavedNote[]) => {
  title = title.trim().toLowerCase();
  for (const note of notes) {
    const noteTitle = textToTitle(note.text).trim().toLowerCase();
    if (noteTitle === title) {
      return note;
    }
  }
};

const linkify = (md: string, notes: SavedNote[], removeMentions?: boolean) => {
  const matches = md.matchAll(/\[\[([^\[\]]+)\]\]/g);
  Array.from(matches).forEach((match) => {
    const linkedNote = getByTitle(match[1], notes);
    if (linkedNote) {
      md = md.replaceAll(
        match[0],
        `<a epub:type="bodymatter" href="${linkedNote.id}.xhtml">${match[1]}</a>`
      );
    } else if (removeMentions) {
      md = md.replaceAll(match[0], match[1]);
    }
  });
  return md;
};

const removeHashtags = (md: string) => {
  return md.replace(/^ *(#[a-zA-Z0-9_\/]+ *)+$/gm, "");
};

export const make = async ({
  title,
  description,
  author,
  notes,
  noHashtags,
  chapterLabel,
  noMentions,
}: {
  title: string;
  description: string;
  author: string;
  notes: { downloadable: DownloadableNote; saved: SavedNote }[];
  noHashtags?: boolean;
  chapterLabel?: boolean;
  noMentions?: boolean;
}) => {
  return new Promise(async (res) => {
    const chapters: Chapter[] = [];
    for (const note of notes) {
      let md = note.downloadable.text;
      if (noHashtags) {
        md = removeHashtags(md);
      }
      let content = await mdToHtml(md);
      content = linkify(
        content,
        notes.map((n) => n.saved),
        noMentions
      );
      chapters.push({
        id: note.saved.id,
        title: textToTitle(note.saved.text),
        images: [],
        url: "test",
        content,
        number: chapters.length + 1,
      });
    }

    const epub: Epub = {
      title,
      description,
      images: [],
      chapters,
      author,
      publisher: "RetroNote",
    };
    let zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");
    zip.file("META-INF/container.xml", container());
    zip.file("OEBPS/content.opf", content(epub));
    zip.file("OEBPS/toc.xhtml", toc(epub));
    epub.chapters.forEach((chapter) => {
      zip.file(
        `OEBPS/${chapter.id}.xhtml`,
        getChapter(chapter, { chapterLabel })
      );

      // chapter.images.forEach(([id, type, blob]) => {
      //   zip.file(`OEBPS/images/${id}`, blob);
      // });
    });
    zip
      .generateAsync({ type: "blob", mimeType: "application/epub+zip" })
      .then((content) => {
        // saveAs(content, `${title}.epub`);
        res(content);
      });
  });
};
