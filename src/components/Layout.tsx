import { FC, ReactNode } from "react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <div>{children}</div>
  </>
);

export default Layout;
