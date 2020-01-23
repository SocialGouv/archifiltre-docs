import React, { FC } from "react";

import Dashboard from "components/header/dashboard/dashboard-container";

interface HeaderProps {
  api: any;
}

const Header: FC<HeaderProps> = ({ api }) => {
  return (
    <div className="grid-x grid-padding-y align-middle">
      <Dashboard api={api} />
    </div>
  );
};

export default Header;
