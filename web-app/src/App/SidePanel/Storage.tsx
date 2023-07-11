import classNames from "classnames";
import { ComponentProps, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "src/comps/Button";
import { PouchContext } from "src/App/PouchDB";

const Label = ({
  className,
  children,
  ...restProps
}: ComponentProps<"label">) => {
  return (
    <label
      className={twMerge("block text-xs font-medium", className)}
      {...restProps}
    >
      {children}
    </label>
  );
};

const Input = ({
  className,
  disabled,
  ...restProps
}: ComponentProps<"input">) => {
  return (
    <input
      disabled={disabled}
      className={twMerge(
        classNames(
          "mt-1 w-full rounded-md border border-primary",
          "border-opacity-30 sm:text-sm p-2 bg-primary",
          {
            "bg-opacity-0 shadow-sm": !disabled,
            "bg-opacity-20 opacity-50": disabled,
          }
        ),
        className
      )}
      {...restProps}
    />
  );
};

const Storage = () => {
  const { secret, username, password, setUsername, setPassword, setSecret } =
    useContext(PouchContext);
  const [enabled, setEnabled] = useState<string[]>([]);
  const [enteredSecret, setEnteredSecret] = useState(secret);
  const [enteredUsername, setEnteredUsername] = useState(username || "");
  const [enteredPassword, setEnteredPassword] = useState(password || "");

  const toggleEnable = (type: string) => {
    setEnabled((enabled) => {
      const newEnabled = [...enabled];
      if (newEnabled.includes(type)) {
        newEnabled.splice(newEnabled.indexOf(type), 1);
      } else {
        newEnabled.push(type);
      }
      return newEnabled;
    });
  };

  const handleUPSave = () => {
    if (username !== enteredUsername && password !== enteredPassword) {
      setUsername(enteredUsername);
      setPassword(enteredPassword);
      alert("Updated!");
    }
    setEnabled([]);
  };

  const handleSecretSave = () => {
    if (enteredSecret && enteredSecret !== secret) {
      setSecret(enteredSecret);
    }
    setEnabled([]);
  };

  return (
    <div className="space-y-10 p-2 w-full max-w-[400px]">
      <div>
        <div className="mb-2">
          <Label>Secret</Label>
          <Input
            type="text"
            value={enteredSecret}
            placeholder="Secret for encryption"
            disabled={!enabled.includes("secret")}
            onChange={(e) => setEnteredSecret(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2 mb-2">
          <Button
            lite
            className="text-sm"
            onClick={() => toggleEnable("secret")}
          >
            {enabled.includes("secret") ? "Cancel" : "Update"}
          </Button>
          <Button
            className="text-sm"
            disabled={!enabled.includes("secret")}
            onClick={handleSecretSave}
          >
            Save
          </Button>
        </div>
        <div className="text-xs opacity-60">
          <strong>Cautious!</strong> "Secret" is used to encrypt your data. You
          will have to use same secret, username, and passwords on your other
          devices to keep them sync.
        </div>
      </div>
      <div>
        <div className="space-y-2 flex flex-col">
          <div className="w-full">
            <Label>Username</Label>
            <Input
              value={enteredUsername}
              type="text"
              placeholder="Username for sync"
              disabled={!enabled.includes("username")}
              onChange={(e) => setEnteredUsername(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label>Sync key</Label>
            <Input
              value={enteredPassword}
              type="text"
              placeholder="Password for sync"
              disabled={!enabled.includes("password")}
              onChange={(e) => setEnteredPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 mb-2">
            <Button
              lite
              className="text-sm"
              onClick={() => {
                toggleEnable("username");
                toggleEnable("password");
              }}
            >
              {enabled.includes("username") || enabled.includes("password")
                ? "Cancel"
                : "Update"}
            </Button>
            <Button
              className="text-sm"
              onClick={handleUPSave}
              disabled={!enabled.includes("username")}
            >
              Save
            </Button>
          </div>
          <div className="text-xs opacity-60">
            <strong>
              Username & Sync keys are provided by the maker{" "}
              <a
                href="https://twitter.com/pramodk73"
                className="hover:underline italic"
                target="_blank"
                rel="noreferrer"
              >
                @pramodk73
              </a>
              . It is manual just to fight against spam :). Please DM him to get
              them.
            </strong>{" "}
            They are used to sync your data across the devices. Make sure they
            are valid before saving them.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
