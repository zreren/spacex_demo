interface ILink {
  small: string;
  large: string;
}

interface IRedditLinks {
  campaign: string;
  launch: string;
  media: string;
  recovery: string;
}

interface IFlickrLinks {
  small: string[];
  original: string[];
}

interface ILinks {
  patch: ILink;
  reddit: IRedditLinks;
  flickr: IFlickrLinks;
  presskit: string;
  webcast: string;
  youtube_id: string;
  article: string;
  wikipedia: string;
}

interface ICore {
  core: string;
  flight: number;
  gridfins: boolean;
  legs: boolean;
  reused: boolean;
  landing_attempt: boolean;
  landing_success: boolean;
  landing_type: string;
  landpad: string;
}

interface ICrew {
  [index: number]: string;
}

export interface IDoc {
  fairings: null;
  links: ILinks;
  static_fire_date_utc: string;
  static_fire_date_unix: number;
  tdb: boolean;
  net: boolean;
  window: number;
  rocket: string;
  success: boolean;
  failures: any[];
  details: string;
  crew: ICrew;
  ships: string[];
  capsules: string[];
  payloads: string[];
  launchpad: string;
  auto_update: boolean;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: string;
  upcoming: boolean;
  cores: ICore[];
  id: string;
}



  
export interface IResponse {
    docs: IDoc[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    page: number;
    pagingCounter: number;
    prevPage: number | null;
    totalDocs: number;
    totalPages: number;
}