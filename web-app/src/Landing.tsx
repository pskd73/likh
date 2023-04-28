import Clickable from "./components/Clickable";

const steps = [
  "Add topics you are interested in",
  "Add the daily calendar event",
  "Pick a Retro Notensuggested topic to write about. Repeat it daily!",
];

const Landing = () => {
  return (
    <div className="min-h-[100vh] w-full">
      <div className="p-4 min-h-[100vh] text-slate-700 dark:bg-iblack dark:text-iwhite flex justify-center text-lg">
        <div className="max-w-[900px] space-y-10">
          <div>
            <h1 className="text-5xl mb-4">Build writing habits</h1>
            <p className="leading-normal">
              Writing is a way to{" "}
              <span className="underline">articulate thoughts</span>. Don't let
              AI trick you! Start building{" "}
              <span className="underline">writing habits</span> in a{" "}
              <span className="underline">distraction free, focused</span>{" "}
              environment.
            </p>
          </div>
          <div>
            <p className="mb-2">Just follow below steps</p>
            <ul>
              {steps.map((step, i) => (
                <li className="flex">
                  <div className="mr-2">{i + 1}.</div>
                  <div>{step}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <Clickable>
              <a href="/app">start now &rarr;</a>
            </Clickable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
