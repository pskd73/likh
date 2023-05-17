import Auth from "@/components/Landing/Auth";
import Feature from "@/components/Landing/Feature";
import Hero, { Highlight } from "@/components/Landing/Hero";
import Join from "@/components/Landing/Join";
import Nav, { Footer } from "@/components/Landing/Nav";

export default function Landing() {
  return (
    <div className="bg-base text-primary-700">
      <Auth />
      <div className="hidden bg-opacity-10" />
      <div className="relative bg-[url('/hero_bg.png')] bg-center px-2 md:px-0 pb-14">
        <Nav />
        <Hero />
      </div>
      <div className="space-y-6">
        <Feature bg>
          <Feature.Content>
            <Feature.Title>Quick start</Feature.Title>
            <Feature.List>
              <Feature.Item>
                Get <Highlight>suggestions</Highlight> on the topics to write to
                get started quick
              </Feature.Item>
              <Feature.Item>
                Setup daily <Highlight>reminders</Highlight>
              </Feature.Item>
              <Feature.Item>
                Check the <Highlight>streak</Highlight>
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
            <Feature.Title>Share</Feature.Title>
            <Feature.List>
              <Feature.Item>
                Share your <Highlight>notes with public quickly</Highlight>{" "}
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
      </div>
      <Join />
      <Footer />
    </div>
  );
}
