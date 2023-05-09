import Clickable from "../components/Clickable";
import Goal from "./Goal";
import Streak from "./Streak";
import Suggestions from "./Suggestions";

const Home = () => {
  return (
    <div className="flex space-x-4">
      <div className="w-8/12">
        <Suggestions />
      </div>
      <div className="w-4/12 space-y-6">
        <div>
          <Clickable className="text-lg" lite>
            Add reminder &rarr;
          </Clickable>
        </div>
        <Streak />
        <Goal />
      </div>
    </div>
  );
};

export default Home;
