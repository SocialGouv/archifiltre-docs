import { PRODUCT_CHANNEL } from "@common/config";
import React from "react";

import { useStyles } from "../../hooks/use-styles";
import { StaticImage } from "./StaticImage";

export interface LogoProps {
  height: number;
}
export const Logo: React.FC<LogoProps> = ({ height }) => {
  const { logoChannel } = useStyles();

  return (
    <>
      <StaticImage src="imgs/logo.png" alt="logo-archifiltre" height={height} />
      <div className={logoChannel} style={{ height }}>
        {PRODUCT_CHANNEL}
      </div>
    </>
  );
};
