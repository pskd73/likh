import { useContext } from "react";
import Browse from "./Home/Browse";
import Search from "./SidePanel/Search";
import { EditorContext } from "./Context";
import Notes from "./Home/Notes";
import { WithTitle } from "./SidePanel/Common";
import Trash from "./Home/Trash";

const MobileSearch = () => {
  const { searchTerm, setSearchTerm } = useContext(EditorContext);

  return (
    <div className="space-y-4 pb-20">
      <Search onChange={(v) => setSearchTerm(v)} searchTerm={searchTerm} />
      {searchTerm ? (
        <div>
          <Notes />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <Browse />
          </div>
          <WithTitle title="Trash" active={false} noPadding>
            <Trash />
          </WithTitle>
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
