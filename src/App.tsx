import React, { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { muiConfig } from "./assets/config";
import "./App.css";

import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

// 组件icon
import StyledInputBase from "./components/Search";
import Detail from "./components/Detail";
import ListItem from "./components/ListItem";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Fab,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// 类型定义
import type { IDoc, IResponse } from "./types/api";
import type { LaunchStatus,SortType } from "./types/common";
import type { DetailType } from "./types/common";

/**
 * 睡眠函数
 * @param ms
 * @returns
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const currentDate = new Date().toISOString().split("T")[0];
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // 根据项目进行抽离，这里简单定义变量配置
  const BASEURL = "https://api.spacexdata.com/v5";

  const [detail, setDetail] = useState<DetailType | null>();


  const [searchContent, setSearchContent] = React.useState<string>("");
  const [startDate, setStartDate] = useState<string>("2007-06-07");
  const [endDate, setEndDate] = useState<string>(currentDate);
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>(
    "all"
  );
  const [sort, setSort] = useState<SortType>("desc");

  const customTheme = () => createTheme(muiConfig);

  const lastItemRef:MutableRefObject<null> = useRef(null);

  /**
   * 观察是否到底部进行自动加载下一页
   * @param entries
   */
  const onIntersection = async (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries[0];
    if (intersectionEntry.isIntersecting) {
      await fetchNextPage();
    }
  };

  /**
   * 挂载观察者
   */
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

  /**
   * 滚动到头部
   */
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * 请求函数
   * @param param0
   * @returns
   */
  const fetchingData: QueryFunction<IResponse, QueryKey> = async ({
    queryKey,
    pageParam = 1,
  }) => {
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
            launchStatus === "all" ? { $in: ["true", "false"] } : launchStatus,
        },
        options,
      }),
    });
    // 方便看加载效果
    await sleep(500);
    return response.json();
  };

  /**
   * useInfiniteQuery进行分页加载及数据处理
   */
  const { data, isFetching, refetch, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery<IResponse>(["query", searchContent], fetchingData, {
      enabled: false,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.hasNextPage) {
          return undefined;
        } else {
          return lastPage.nextPage;
        }
      },
    });

  /**
   * 重新加载
   */
  const handleSearch = async (): Promise<void> => {
    console.log("handleSearch");
    setShouldRefetch(true);
  };

  /**
   * 在一个 useEffect 钩子中，根据 shouldRefetch 的值决定是否重新加载数据
   */
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false); // 重置 shouldRefetch 的值
    }
  }, [shouldRefetch, refetch]);

  /**
   * 卡片点击事件
   * @param item {IDoc}
   */
  const handleClickItem = (item: IDoc): void => {
    // 过滤数据 保留需要的字段
    const {
      name,
      date_utc,
      details,
      links: { patch, youtube_id, flickr } = item.links || {},
    } = item || {};

    const _detail = {
      name,
      date_utc,
      details,
      links: {
        patch: {
          small: patch?.small,
          large: patch?.large,
        },
        youtube_id,
        flickr: {
          original: flickr?.original,
          small: flickr?.small,
        },
      },
    };

    try {
      setDetail(_detail);
    } catch (error) {
      console.error("Failed to set detail:", error);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative", display: detail ? "none" : "flex" }}
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
                sm: 0,
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              paddingTop: 3,
              background: "rgba(40,40,40,0.8)",
              backdropFilter: "blur(20px)",
              alignItems: "center",
              zIndex: 99,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                whiteSpace: "nowrap",
                width: 140,
              }}
            >
              Space X
            </Typography>
            <StyledInputBase
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
              placeholder="search"
              inputProps={{ "aria-label": "search" }}
              onKeyPress={(event: React.KeyboardEvent) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Grid
              container
              columns={{
                xs:2,
                md:4
              }}
              maxWidth={610}
              paddingX={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={1} display={"flex"} justifyContent={"flex-end"}>
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
              </Grid>

              <Grid item xs={1} display={"flex"} justifyContent={"flex-start"}>
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
              </Grid>

              <Grid item xs={1} display={"flex"} justifyContent={"flex-end"}>
                <FormControl sx={{ width: 150 }}>
                  <InputLabel color="info" id="launchStatus">
                    发射状态
                  </InputLabel>
                  <Select
                    labelId="launchStatus"
                    id="launchStatus"
                    value={launchStatus}
                    label="发射状态"
                    onChange={(e) =>
                      setLaunchStatus(e.target.value as LaunchStatus)
                    }
                  >
                    <MenuItem value="all">全部</MenuItem>
                    <MenuItem value="true">成功</MenuItem>
                    <MenuItem value="false">失败</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={1} display={"flex"} justifyContent={"flex-start"}>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="launchStatus">排序</InputLabel>
                <Select
                  labelId="launchStatus"
                  id="launchStatus"
                  value={sort}
                  label="发射状态"
                  onChange={(e) => setSort(e.target.value as SortType)}
                >
                  <MenuItem value={"desc"}>从近到远</MenuItem>
                  <MenuItem value={"asc"}>从远到近</MenuItem>
                </Select>
              </FormControl>
              </Grid>

            </Grid>

            <button onClick={handleSearch}>筛选</button>
          </Box>
        </ThemeProvider>

        <>
          {error && (
            <>
              <Box>
                <Typography>Could not fetch that.</Typography>
                <Button>Try Again</Button>
              </Box>
            </>
          )}
        </>

        {/* 数据列表 */}
        <>
          {data?.pages?.[0]?.docs && (
            <Fab
              onClick={scrollToTop}
              sx={{ position: "fixed", bottom: 30, right: 50, opacity: 0.6 }}
              aria-label="add"
            >
              <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
            </Fab>
          )}
          <Grid
            container
            columns={{ xs: 2, sm: 2 }}
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{
              marginTop: {
                md: 20,
                xs: 4,
              },
              padding: 2,
              width: {
                lg: 1200,
                md: 1000,
                sm: 500,
              },
              minHeight: "10vh",
            }}
          >
            {data?.pages.map((items: IResponse, index: number) => {
              if (!items?.docs) return;
              const { docs } = items;
              return docs?.map((item: IDoc) => {
                const {
                  id,
                  links: {
                    flickr: { original: [originalImage] = [] } = {},
                    patch: { small: smallImage } = item.links.patch,
                  } = {},
                  name,
                  date_utc: date,
                } = item;

                const imageURL = originalImage || smallImage;

                return (
                  <Grid item xs={2} sm={1} key={id}>
                    <ListItem
                      onClick={() => {
                        handleClickItem(item);
                      }}
                      key={index}
                      imageURL={imageURL}
                      title={name}
                      id={id}
                      date={date}
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
          {isFetching ? <CircularProgress color="inherit" /> : null}
        </Typography>

        <Typography sx={{ marginBottom: 10 }}>
          {!hasNextPage &&
            !isFetching &&
            data?.pages?.[0]?.docs &&
            "Nothing to load"}
        </Typography>

        <Typography>
          {!isFetching && !data?.pages?.[0]?.docs && "Please Click to search"}
        </Typography>
      </Grid>

      {/* 详情 使用Drawer进行查看，保存了列表原有的位置 */}
      {detail && (
        <Drawer
          sx={{
            background: "black",
            "& .MuiPaper-root": {
              backgroundColor: "black",
              color: "white",
            },
          }}
          anchor={"top"}
          open={true}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Detail
              detail={detail}
              onBackClick={() => {
                setDetail(null);
              }}
            ></Detail>
          </Grid>
        </Drawer>
      )}
    </>
  );
}

export default App;
