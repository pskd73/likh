import { PropsWithChildren } from "react";

export function BasePage({ children }: PropsWithChildren) {
  return (
    <div className="bg-base text-primary-700 min-h-[100vh]">{children}</div>
  );
}

export function Paper({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[860px] py-10 px-6 md:px-0">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="text-center opacity-50">•••</div>
      <div className="text-center">
        <a
          href="https://retronote.app"
          className="opacity-50 hover:opacity-100 hover:underline"
        >
          Retro Note
        </a>
        <span className="opacity-50">
          &nbsp;•&nbsp;Built with &lt;3 by&nbsp;
        </span>
        <a
          className="opacity-50 hover:opacity-100 hover:underline"
          href="https://twitter.com/@pramodk73"
          target="_blank"
          rel="noreferrer"
        >
          @pramodk73
        </a>
      </div>
    </footer>
  );
}
