import * as React from "react";

const notes: Note[] = [
  {
    title: "10 tips for optimizing Python code",
    text: "",
    createdAt: new Date().getTime(),
    hashtags: []
  },
  {
    title: "The concept of self in Eastern and Western philosophy",
    text: "",
    createdAt: new Date().getTime(),
    hashtags: []
  },
  {
    title: "The meaning behind 'The Lottery' by Shirley Jackson",
    text: "",
    createdAt: new Date().getTime(),
    hashtags: []
  },
  {
    title: "The impact of social media on mental health in teenagers",
    text: "",
    createdAt: new Date().getTime(),
    hashtags: []
  }
]

const SideBar = () => {
  return (
    <div className="w-96">
      My list<br/>
      ------

      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li>{i + 1}. {note.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default SideBar;