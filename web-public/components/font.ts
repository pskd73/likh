import { Courier_Prime, PT_Serif } from "next/font/google";

export const Courier = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const PTSerif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export function getUserBlogFont(user: User) {
  if (user?.setting?.blog_font === "CourierPrime") {
    return Courier;
  }
  if (user?.setting?.blog_font === "PTSerif") {
    return PTSerif;
  }
  return Courier;
}
