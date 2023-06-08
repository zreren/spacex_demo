import { useEffect, useMemo, useRef, useState } from "react";
import StyledInputBase from "./components/Search";
import "./App.css";
import React from "react";
import {  useInfiniteQuery } from "@tanstack/react-query";
import type { IDoc, IResponse } from "./types/api";
import ListItem from "./components/ListItem";
import {
  Box,
  CircularProgress,
  Fab,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { muiConfig } from "./assets/config";
import Detail from "./components/Detail";
import { launchStatus } from "./types/common";


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const currentDate = new Date().toISOString().split("T")[0];

  // 根据项目进行抽离，这里简单定义变量配置
  const BASEURL = "https://api.spacexdata.com/v5";

  const [detail, setDetail] = useState<IDoc | null>();

  const [searchContent, setSearchContent] = React.useState<string>("");
  const [startDate, setStartDate] = useState<string>("2007-06-07");
  const [endDate, setEndDate] = useState<string>(currentDate);
  const [launchStatus, setLaunchStatus] = useState<"all" | "true" | "false">("all");
  const [sort, setSort] = useState<string>("desc");
  

  const customTheme = () => createTheme(muiConfig);

  const lastItemRef = useRef(null);


  // 观察是否到底部进行自动加载下一页
  const onIntersection = async (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries[0];
    if (intersectionEntry.isIntersecting) {
      await fetchNextPage();
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      rootMargin: "100px",
      threshold: 0.5,
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }
    // 卸载观察
    return () => {
      observer.disconnect();
    };
  }, [lastItemRef]);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // useInfiniteQuery进行分页加载及数据处理
  const {
    data,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IResponse>(
    ["query", searchContent],
    async ({ queryKey, pageParam = 1 }) => {
      const options = {
        limit: 6,
        page: pageParam,
        sort: {
          date_utc: sort,
        },
      };
      const [, query] = queryKey;

      if (!query) return null;

      const response = await fetch(`${BASEURL}/launches/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            $text: {
              $search: query,
            },
            date_utc: {
              $gte: new Date(startDate).toISOString(),
              $lte: new Date(endDate).toISOString(),
            },
            success:
              launchStatus === "all"
                ? { $in: ["true", "false"] }
                : launchStatus,
          },
          options,
        }),
      });
      // 方便看加载效果
      await sleep(500);
      return response.json();
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.hasNextPage) {
          return undefined;
        } else {
          return lastPage.nextPage;
        }
      },
    }
  );

  const handleSearch = async ():Promise<void>=>{
      refetch();
  }

  if (detail) {
    return (
      <Detail
        detail={detail}
        onBackClick={() => {
          setDetail(null);
        }}
      ></Detail>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative" }}
      >


        {/* 顶部菜单栏 */}
        <ThemeProvider theme={customTheme()}>
          <Box
            sx={{
              display: "flex",
              width: "100vw",
              gap: 3,
              paddingBottom: 2,
              position: {
                xs: "relative",
                sm: "fixed",
              },
              justifyContent: "center",
              top: {
                xs: -80,
                sm: 0,
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              paddingTop: 3,
              background: "#333",
              alignItems: "center",
              zIndex: 99,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
              }}
            >
              Space x
            </Typography>
            <StyledInputBase
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
              placeholder="search by category, retailer or brand"
              inputProps={{ "aria-label": "search" }}
              onKeyPress={() => {}}
            />
            <TextField
              id="startDate"
              label="开始发射时间"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="endDate"
              label="结束发射时间"
              type="date"
              sx={{ color: "white" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl sx={{ width: 150 }}>
              <InputLabel color="info" id="launchStatus">
                发射状态
              </InputLabel>
              <Select
                labelId="launchStatus"
                id="launchStatus"
                value={launchStatus}
                label="发射状态"
                onChange={(e) => setLaunchStatus(e.target.value as launchStatus)}
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value={"true"}>成功</MenuItem>
                <MenuItem value={"false"}>失败</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel color={"primary"} id="launchStatus">
                排序
              </InputLabel>
              <Select
                labelId="launchStatus"
                id="launchStatus"
                value={sort}
                label="发射状态"
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value={"desc"}>从近到远</MenuItem>
                <MenuItem value={"asc"}>从远到近</MenuItem>
              </Select>
            </FormControl>
            <button onClick={handleSearch}>筛选</button>

           
          </Box>
        </ThemeProvider>

        {/* 数据列表 */}
        <>
          {data?.pages?.[0]?.docs && (
            <Fab
              onClick={scrollToTop}
              sx={{ position: "fixed", bottom: 30, right: 50 }}
              color="primary"
              aria-label="add"
            >
              ↑
            </Fab>
          )}
          <Grid
            container
            columns={{ xs: 2, sm: 2 }}
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{
              marginTop: 12,
              padding: 2,
              width: {
                lg: 1200,
                md: 1000,
                sm: 500,
              },
              minHeight: "10vh",
            }}
          >
            {data?.pages.map((items:IResponse, index:number) => {
              if (!items?.docs) return;
              const { docs } = items;
              return docs?.map((item:IDoc) => {
                return (
                  <Grid item xs={2} sm={1} key={item?.id}>
                    <ListItem
                      onClick={() => {
                        setDetail(item);
                      }}
                      key={index}
                      imageURL={
                        item?.links?.flickr?.original?.[0] ||
                        item.links?.patch?.small
                      }
                      title={item?.name}
                      id={item?.id}
                      date={item?.date_utc}
                    ></ListItem>
                  </Grid>
                );
              });
            })}
            {/* 底部继续加载 */}
            <div ref={lastItemRef}></div>
          </Grid>
        </>

        <Typography>
          {/* 加载状态 */}
          {isFetching ? (
            <CircularProgress color="inherit" />
          ) : null}
        </Typography>

        <Typography sx={{marginBottom:10}}>
          {!hasNextPage && !isFetching && data?.pages?.[0]?.docs && (
            'Nothing to load'
          )}
        </Typography>

        <Typography>
          {!isFetching && !data?.pages?.[0]?.docs && "Please Click to search"}
        </Typography>
      </Grid>
    </>
  );
}

export default App;
