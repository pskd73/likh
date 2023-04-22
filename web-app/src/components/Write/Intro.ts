import { Note } from "../../type";
import { getNextId } from "../localStorage";

export const getIntroNote = (): Note => {
  return {
    id: getNextId("note"),
    title: "Introduction",
    text: 
`This is a simple note taking app to build up writing habits and write without distractions. It is all old school here. No styles or corrections. Corrections and styling come in the later phases. The writing experience here will be as close as possible to writing on a white paper with a pen.

This not itself is a sample one. Checkout "Help" section for more info. Following are few tips

Tips
~~~~
1. All notes are saved on the local PC by default.
2. Swith on "focus" mode to get into full writing zone. No distractions.

Happy writing :)

`,
    createdAt: new Date().getTime(),
    hashtags: [],
  };
};
