// BilibiliLive object which is available on live.bilibili.com

export {};

declare global {
  interface Window {
    BilibiliLive: typeof BilibiliLive;
  }

  let BilibiliLive: {
    ANCHOR_UID: number;
    AREA_ID: number;
    COLORFUL_LOGGER: boolean;
    INIT_TIME: number;
    PARENT_AREA_ID: number;
    RND: number;
    ROOMID: number;
    SHORT_ROOMID: number;
    UID: number;
  };
}
