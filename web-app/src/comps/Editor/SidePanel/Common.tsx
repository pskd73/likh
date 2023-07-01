import { PropsWithChildren } from "react";

export const WithTitle = ({
  title,
  children,
}: PropsWithChildren & { title: string }) => {
  return (
    <div className="p-4">
      <div className="text-xs font-bold text-primary text-opacity-40 mb-2">
        {title.toUpperCase()}
      </div>
      <div>{children}</div>
    </div>
  );
};
