import Auth from "@/components/Landing/Auth";
import Feature from "@/components/Landing/Feature";
import Hero, { Highlight } from "@/components/Landing/Hero";
import Join from "@/components/Landing/Join";
import Nav, { Footer } from "@/components/Landing/Nav";
import Event from "@/components/Event";

export default function Landing() {
  return (
    <div className="bg-base text-primary-700">
      <Event name="landing_page" />
      <Auth />
      <div className="hidden bg-opacity-10" />
      <div className="relative bg-[url('/hero_bg.png')] bg-center px-2 md:px-0 py-16">
        {/* <Nav /> */}
        <Hero />
      </div>
      {/* <div className="space-y-6" id="features">
        <Feature bg>
          <Feature.Content>
            <Feature.Title>Privacy</Feature.Title>
            <Feature.List>
              <Feature.Item>
                All notes are <Highlight>auto saved</Highlight> on your
                computer!
              </Feature.Item>
              <Feature.Item>
                Download your notes as <Highlight>.md</Highlight> files at any
                time. <Highlight>No lock in!</Highlight>
              </Feature.Item>
              <Feature.Item>
                <Highlight>Multi device</Highlight> support (coming soon)
              </Feature.Item>
            </Feature.List>
          </Feature.Content>
          <Feature.Demo>
            <Feature.DemoImg>
              <img
                src="/Quick Start Retro Note.png"
                alt="Quick start - Retro Note"
              />
            </Feature.DemoImg>
          </Feature.Demo>
        </Feature>

        <Feature>
          <Feature.Content>
            <Feature.Title>Focused writing</Feature.Title>
            <Feature.List>
              <Feature.Item>
                Write peacefully <Highlight>without distraction</Highlight>
              </Feature.Item>
              <Feature.Item>
                Track the <Highlight>goal</Highlight>
              </Feature.Item>
              <Feature.Item>
                Group notes by <Highlight>hashtags</Highlight>
              </Feature.Item>
              <Feature.Item>
                <Highlight>Markdown</Highlight> support
              </Feature.Item>
            </Feature.List>
          </Feature.Content>
          <Feature.Demo>
            <Feature.DemoImg>
              <img
                src="/Write Retro Note.png"
                alt="Focused Writing - Retro Note"
              />
            </Feature.DemoImg>
          </Feature.Demo>
        </Feature>

        <Feature bg>
          <Feature.Content>
            <Feature.Title>Blog</Feature.Title>
            <Feature.List>
              <Feature.Item>
                Build a <Highlight>blog quickly out of your notes</Highlight>{" "}
                without leaving the app
              </Feature.Item>
              <Feature.Item>
                <Highlight>SEO</Highlight> friendly
              </Feature.Item>
              <Feature.Item>
                Get <Highlight>metrics</Highlight>
              </Feature.Item>
            </Feature.List>
          </Feature.Content>
          <Feature.Demo>
            <Feature.DemoImg>
              <img src="/Share Retro Note.png" alt="Share - Retro Note" />
            </Feature.DemoImg>
          </Feature.Demo>
        </Feature>
      </div> */}
      <Footer />
    </div>
  );
}
