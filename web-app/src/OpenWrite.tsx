import { useEffect } from "react";
import { Paper } from "./comps/Layout";
import MEditor from "./comps/MEditor";
import { randomInt } from "./util";
import Event from "./components/Event";

const SAMPLE_NOTES = [
  `# Kevin the Clumsy Kangaroo: From Trips to Triumphs!

Once upon a time, there was a clumsy kangaroo named Kevin. Kevin's hopping skills were far from perfect, and he often tripped over his own feet. One day, while attempting to impress his kangaroo friends with a magnificent jump, Kevin ended up crashing into a tree.

Embarrassed but undeterred, Kevin decided to take hopping lessons. He enrolled in a class taught by a wise old kangaroo named Mr. Bounce-a-Lot. Mr. Bounce-a-Lot taught Kevin different techniques, emphasizing balance and coordination.

Weeks passed, and Kevin practiced diligently, determined to become the hopping champion. Finally, the day of the Great Kangaroo Jumping Contest arrived. Kevin's heart raced with excitement as he stood alongside the other contestants.

When it was his turn, Kevin took a deep breath and focused. He pushed off the ground with all his might, soaring through the air. The crowd gasped in awe as Kevin gracefully cleared the highest bar, setting a new record.

Everyone cheered for __Kevin__, the once-clumsy _kangaroo_ who had become a hopping superstar. And from that day forward, Kevin's fame spread throughout the kangaroo community, inspiring other clumsy creatures to embrace their imperfections and reach for the stars, or in Kevin's case, the treetops.`,
  `# The Goat Who Found His Voice... Without Words!

Once upon a time, in a sleepy little village, there was a mischievous goat named Gary. Gary had a peculiar obsession with eating everything in sight, from clothes to tin cans. The villagers were fed up with his antics and decided to hold a town meeting to address the issue.

During the meeting, the village mayor proposed a hilarious solution. They would hire a professional mime to teach Gary the art of miming. The villagers believed that if Gary learned to express himself without words, he might overcome his insatiable appetite.

The mime, named Marcel, arrived in the village and began working with Gary. With exaggerated gestures and _invisible walls_, Marcel taught the goat to communicate through actions rather than devouring everything.

Days turned into weeks, and slowly but surely, Gary started mimicking Marcel's movements. The villagers watched in amazement as the goat transformed into a silent performer, amusing everyone with his imitations.

One sunny afternoon, the village held a grand performance, showcasing Gary's newfound talent. The crowd erupted in laughter as Gary imitated Marcel's classic "trapped in a box" routine flawlessly.

From that day forward, __Gary__ became the beloved entertainment of the village, bringing joy and laughter wherever he went. And as for his eating habits, well, let's just say he developed a newfound appreciation for lettuce and carrots, leaving the clothes and tin cans behind.`,
];

const OpenWrite = () => {
  useEffect(() => {
    Event.track("open_write");
  }, []);
  return (
    <div className="min-h-[100vh] bg-base text-primary-700 py-10">
      <Paper>
        <MEditor
          onChange={() => {}}
          initText={SAMPLE_NOTES[randomInt(0, 1)]}
          typeWriter
        />
      </Paper>
    </div>
  );
};

export default OpenWrite;
