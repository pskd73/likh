import Logo from "@/components/Logo";
import { ImageResponse } from "next/server";

export const runtime = "edge";

const colors = {
  "primary-700": "#6C6327",
  "primary-500": "#CDC596",
  "primary-400": "#E9E3C2",
  base: "#FFFEF8",
};

const fontCourierPrime = fetch(
  new URL("../../assets/CourierPrime-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontPTSerif = fetch(
  new URL("../../assets/PTSerif-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fontCourierPrimeData = await fontCourierPrime;
  const fontPTSerifData = await fontPTSerif;

  const title = searchParams.get("title");
  const author = searchParams.get("author");

  return new ImageResponse(
    (
      <div
        className="bg-base"
        style={{
          background: colors["base"],
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: colors["primary-700"],
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", width: 100, height: 100 }}>
              <Logo fill={colors["primary-700"]} />
            </div>
            <div style={{ fontSize: 32 }}>Retro Note</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "PT Serif",
              padding: "40px 40px",
            }}
          >
            <div style={{display: "flex", fontSize: 52,}}>{title}</div>
            <div style={{display: "flex"}}>By {author}</div>
          </div>
          <div style={{ padding: "10px 40px", opacity: "0.5" }}>
            Start building writing habits now on https://retronote.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Courier Prime",
          data: fontCourierPrimeData,
          style: "normal",
        },
        {
          name: "PT Serif",
          data: fontPTSerifData,
          style: "normal",
        },
      ],
    }
  );
}
