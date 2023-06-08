import { outlinedInputClasses } from "@mui/material";

export const  muiConfig = {
    components: {
      MuiInputBase :{
        styleOverrides:{
          root:{
           
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
            '& .MuiInputBase-input':{
              color : "white"
            },
            '& .MuiFormLabel-root':{
                color : "white"
            },
          },
        },
      },
      MuiSelect:{
        styleOverrides:{
          select :{
              color : "white",
          },
          notchedOutline: {
            borderWidth : 0
          },
          root:{
            '& .MuiSvgIcon-root':{
              color:"white"
            },
            fontSize: 14
          }
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderWidth : 0
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderWidth : 0
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderWidth : 0
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&:before, &:after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&:before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
            '&.MuiFormLabel-root':{
                color : "white"
            },
            '&.MuiSvgIcon-root':{
              color:"white"
            },
          },
        },
      },
      MuiFormLabel:{
        styleOverrides:{
          root: {
            color: "white",
            "&.Mui-focused":{
              color:"white"
            }
          },
        },
      },
    },
  }