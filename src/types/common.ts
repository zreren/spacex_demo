export type LaunchStatus = "all" | "true" | "false"
export type SortType = "desc" | "asc" 

export interface DetailType {
    links: {
      youtube_id: string | undefined;
      patch: {
        large: string;
        small: string;
      };
      flickr:{
        original : string [],
        small : string []
      }
    };
    name: string;
    date_utc: string;
    details: string;
  }