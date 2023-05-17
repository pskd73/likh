import { Highlight } from "./Hero";
import SginIn from "./SignIn";

export default function Join() {
  return (
    <div className="flex flex-col items-center py-10" id="pricing">
      <h3 className="text-2xl md:text-6xl text-center font-bold mb-8">
        Join as <Highlight>early</Highlight> bird!
      </h3>
      <div>
        <SginIn />
      </div>
    </div>
  );
}
