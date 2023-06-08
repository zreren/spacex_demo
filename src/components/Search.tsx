import React, { FC } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";

interface RepositoryOptionProps {
  onClick?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
//   flex: "1",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  borderRadius: theme.shape.borderRadius,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    paddingLeft: "20px",
    transition: theme.transitions.create("width"),
  },
}));

export default StyledInputBase;
