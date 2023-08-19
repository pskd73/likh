import { useContext, useEffect, useMemo, useState } from "react";
import { PluginContext } from "./Context";
import JSZip from "jszip";
import saveAs from "file-saver";
import List from "../List";
import ReactDOM from "react-dom/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SavedNote } from "../type";
import { EditorContext } from "../Context";
import { textToTitle } from "src/Note";
import { DownloadableNote, getDownloadableNote } from "../File";
import Event from "src/components/Event";
import { CustomInput, CustomSelect } from "./UI";
import Button from "src/comps/Button";
import { useNavigate } from "react-router-dom";
import { BiBook } from "react-icons/bi";
import { FolderItem } from "../Folders";

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

type Chapter = {
  id: string;
  title: string;
  images: Array<{ id: string; mimeType: string }>;
  url: string;
  content: string;
};

type Epub = {
  description: string;
  title: string;
  chapters: Chapter[];
  images: any;
  author: string;
  publisher: string;
};

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
          <li><a href="toc.xhtml">Table of Contents</a></li>
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

function getChapter(chapter: Chapter) {
  const { title, url, content } = chapter;
  return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
      </head>
      <body>
        <p>
          <a href="${url}">${url}</a>
        </p>
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

const make = async (
  title: string,
  description: string,
  author: string,
  notes: { downloadable: DownloadableNote; saved: SavedNote }[]
) => {
  const chapters: Chapter[] = [];
  for (const note of notes) {
    const content = await mdToHtml(note.downloadable.text);
    chapters.push({
      id: note.saved.id,
      title: textToTitle(note.saved.text),
      images: [],
      url: "",
      content,
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
    zip.file(`OEBPS/${chapter.id}.xhtml`, getChapter(chapter));

    // chapter.images.forEach(([id, type, blob]) => {
    //   zip.file(`OEBPS/images/${id}`, blob);
    // });
  });
  zip
    .generateAsync({ type: "blob", mimeType: "application/epub+zip" })
    .then((content) => {
      saveAs(content, `${title}.epub`);
    });
};

function unique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

type OrderedSavedNote = {
  note: SavedNote;
  idx: number;
};

const Page = () => {
  const navigate = useNavigate();
  const { allNotes, getHashtags, storage } = useContext(EditorContext);
  const hashtags = useMemo(() => getHashtags(), [allNotes]);
  const tagsToShow = useMemo(
    () =>
      Object.keys(hashtags)
        .map((tag) => tag.split("/")[0])
        .filter(unique)
        .sort((a, b) => a.localeCompare(b))
        .filter((t) => !!t),
    [hashtags]
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");

  const chapterNotes = useMemo(() => {
    if (!tag) return [];

    let notes: OrderedSavedNote[] = [];
    for (const _tag of Object.keys(hashtags)) {
      if (_tag.startsWith(tag)) {
        const match = _tag.split("/")[1]?.match(/^chapter_(\d+)$/);
        const idx = match ? Number(match[1]) : 10000000;
        notes = [...notes, ...hashtags[_tag].map((note) => ({ note, idx }))];
      }
    }
    return notes.sort((a, b) => a.idx - b.idx).map((n) => n.note);
  }, [tag, allNotes, hashtags]);

  useEffect(() => {
    Event.track("ebook_page");
  }, []);

  const generate = async () => {
    if (!title || !description || !author || !tag) {
      return alert("Please fill all the details");
    }

    const notes: Array<{ downloadable: DownloadableNote; saved: SavedNote }> =
      [];

    for (const saved of chapterNotes) {
      const downloadable = await getDownloadableNote(saved, storage.pouch);
      notes.push({ downloadable, saved });
    }

    make(title, description, author, notes);
    Event.track("ebook_make");
    setTitle("");
    setDescription("");
    setAuthor("");
    setTag("");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Create eBook</h2>
      <hr />
      <div className="space-y-2 mt-6 flex flex-col">
        <CustomSelect value={tag} onChange={(e) => setTag(e.target.value)}>
          <option disabled selected value={""}>
            Select tag
          </option>
          {tagsToShow.map((tag, i) => (
            <option value={tag}>{tag}</option>
          ))}
        </CustomSelect>
        {!!chapterNotes.length && (
          <div className="text-sm space-y-2 max-w-sm">
            <List>
              {chapterNotes.map((note, i) => (
                <List.Item onClick={() => navigate(`/write/note/${note.id}`)}>
                  {i + 1}. {textToTitle(note.text)}
                </List.Item>
              ))}
            </List>
          </div>
        )}
        <CustomInput
          type="text"
          placeholder="Book name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CustomInput
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <CustomInput
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <div>
          <Button onClick={generate}>Generate .epub</Button>
        </div>
      </div>
    </div>
  );
};

const NavItem = () => {
  const navigate = useNavigate();

  return (
    <FolderItem
      level={0}
      label={"Make Ebook"}
      icon={<BiBook />}
      onClickKind={() => navigate("/write/plugin/ebook")}
    />
    // <List.Item withIcon onClick={() => navigate("/write/plugin/ebook")}>
    //   <List.Item.Icon>
    //     <BiBook />
    //   </List.Item.Icon>
    //   <span>Make Ebook</span>
    // </List.Item>
  );
};

const EBookPlugin = () => {
  const { register } = useContext(PluginContext);

  useEffect(() => {
    register("epug", {
      name: "Epub",
      version: 1,
      navigationItems: [<NavItem />],
      pages: {
        ebook: { page: <Page /> },
      },
    });
  }, []);

  return null;
};

export default EBookPlugin;
