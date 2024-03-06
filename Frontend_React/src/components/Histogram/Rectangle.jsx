import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const Rectangle = ({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  color = "black",
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (y === undefined) {
    return null;
  }

  const style = {
    fill: color,
    filter: `drop-shadow(0.6px 0.6px 4px ${color})`,
    // transition: "all 0.3s ease", // Smooth transition for all properties over 0.3 seconds
  };

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={style}
      className="transition-all duration-500 ease-in-out"
    />
  );
};
