import { useContext } from "react";
import Browse from "./Home/Browse";
import Search from "./SidePanel/Search";
import { EditorContext } from "./Context";
import Notes from "./Home/Notes";

const MobileTags = () => {
  const { searchTerm, setSearchTerm } = useContext(EditorContext);

  return (
    <div className="space-y-4 pb-20">
      <Search onChange={(v) => setSearchTerm(v)} searchTerm={searchTerm} />
      {searchTerm ? (
        <div>
          <Notes />
        </div>
      ) : (
        <div>
          <Browse />
        </div>
      )}
    </div>
  );
};

export default MobileTags;
