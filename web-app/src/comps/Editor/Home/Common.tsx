import { PropsWithChildren } from "react";

export const Title = ({ children }: PropsWithChildren) => {
  return <div className="mb-2 font-bold opacity-50">{children}</div>;
};

export const ListContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-primary bg-opacity-5 p-2 rounded">{children}</div>
  );
};
