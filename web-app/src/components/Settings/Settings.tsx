import Clickable from "../Clickable";
import Toolbar from "../Toolbar";

const Settings = () => {
  return (
    <div>
      <Toolbar>
        <Toolbar.Title>Settings</Toolbar.Title>
        <Toolbar.MenuList>
          <li>
            <Clickable lite>
              <span>option</span>
            </Clickable>
          </li>
        </Toolbar.MenuList>
      </Toolbar>
    </div>
  )
}

export default Settings;