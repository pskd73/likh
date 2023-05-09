import { Paper } from "./comps/Layout";
import Nav from "./comps/Nav";

const AppV2 = () => {
  return (
    <div className="font-SpecialElite text-base text-primary-700 bg-base">
      <Nav />
      <Paper className="py-6">
        <div className="whitespace-pre-wrap">
          <h2 className="text-[48px] mb-4">Lily and the Dragon's Cave</h2>
          Once upon a time, in a small village nestled in a lush forest, there
          lived a young girl named Lily. Lily was known throughout the village
          for her kindness, her intelligence, and her unwavering courage. One
          day, while exploring the woods with her faithful dog, Max, Lily
          stumbled upon a mysterious cave hidden deep in the heart of the
          forest.<br/><br/>
          
          Despite feeling a sense of unease, Lily's curiosity got the
          better of her, and she ventured inside. As she made her way through
          the winding tunnels of the cave, Lily heard strange whispers echoing
          off the walls. She quickened her pace, hoping to reach the end of the
          cave before something terrible happened. Suddenly, she found herself
          face-to-face with a giant dragon! The dragon was fierce and menacing,
          and Lily knew that she had to act quickly if she wanted to survive.
          With Max by her side, Lily drew upon her bravery and intelligence,
          using her quick wits to outsmart the dragon and ultimately defeat it.<br/><br/>
          
          As the dragon lay defeated at her feet, Lily realized that she had
          just experienced the greatest adventure of her life. As she made her
          way through the winding tunnels of the cave, Lily heard strange
          whispers echoing off the walls.
        </div>
      </Paper>
      <Paper>
        <div className="flex justify-center text-center opacity-30 text-sm">
          Built with &lt;3 by @pramodk73
        </div>
      </Paper>
    </div>
  );
};

export default AppV2;
