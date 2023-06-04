import { jsPDF } from "jspdf";
import { SavedNote } from "./type";


export function toPdf(note: SavedNote) {
  // Default export is a4 paper, portrait, using millimeters for units
  const doc = new jsPDF();
  // doc.html(document.body);
  doc.text(note.text, 10, 10);
  doc.save("a4.pdf");
}
