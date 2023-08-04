import { PropsWithChildren, useContext, useEffect } from "react";
import { Select } from "../comps/Form";
import { AppContext } from "../components/AppContext";
import { Helmet } from "react-helmet";
import useFetch from "../useFetch";
import { User } from "../type";
import { API_HOST } from "../config";
import { FullLoader } from "../comps/Loading";

const Item = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>;
};

const Label = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-auto pr-4 md:pr-0 md:w-1/4 flex items-center">
      {children}
    </div>
  );
};

const Value = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

const Settings = () => {
  const { user, setUser } = useContext(AppContext);
  const api = useFetch<User>();

  useEffect(() => {
    if (api.response) {
      setUser({ ...api.response, token: user!.token });
    }
  }, [api.response]);

  const handleChange = (key: string, value: any) => {
    if (user) {
      api.handle(
        fetch(`${API_HOST}/setting`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user!.token}`,
          },
          body: JSON.stringify({
            [key]: value,
          }),
        })
      );
    }
  };

  if (!user) {
    return <FullLoader />;
  }

  return (
    <div className="space-y-4">
      <Helmet>
        <title>Settings - RetroNote</title>
      </Helmet>
      <Item>
        <Label>Blog font</Label>
        <Value>
          <Select
            defaultValue={user.setting?.blog_font || "CourierPrime"}
            onChange={(e) => handleChange("blog_font", e.target.value)}
          >
            <option value={"CourierPrime"}>Courier Prime</option>
            <option value={"PTSerif"}>PT Serif</option>
          </Select>
        </Value>
      </Item>
    </div>
  );
};

export default Settings;
