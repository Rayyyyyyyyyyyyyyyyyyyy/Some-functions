// import extrasImg from "@/assets/images/extras 消息擴充字段物件說明.png"

// v3 api extras
export type TNewExtras = {
  basic?: TExtrasBasic; // 基礎功能
  files?: TExtrasFile[]; // 附加檔案 (list)
  forward?: TExtrasForward; // 轉發來源
  ref?: TExtrasRef; // 回覆來源
  notice?: TExtrasNotice; // 系統通知 - 公告
  verify?: TExtrasVerify; // 系統通知 - 審批
  group?: TExtrasGroup; // 系統通知 - 群通知
  export?: TExtrasExport; // 系統通知 - 匯報
  task?: TExtrasTask; // 系統通知 - 任務
  project?: TExtrasProject; // 系統通知 - 項目
  voice?: TExtrasVoice; // 系統通知 - 語音通話消息
  survey?: TExtrasSurvey; // 系統通知 - 問券
};
// 若資料庫中存放的參數為空值或空字串將不會放入 response 中
// 圖片說明參考 extrasImg

export enum ENoticeTypeForText {
  "審批" = 1,
  "公告",
  "日報",
  "週報",
  "月報",
  "群通知",
  "任務通知",
  "項目通知",
  "提示性消息",
  "问卷通知"
}

export type TExtrasBasic = {
  toFavor?: number; // 是否圍裙收藏 0:否, 1:是
  noticeType?: number; // 通知類型 enum ENoticeType
  addFriendId?: string; //好友 id
  addFriendGroupId?: string; //好友群組 id
  addFriendAvatar?: string; //好友頭像 id
  addFriendName?: string; //好友名稱 id
};

export type TExtrasFile = {
  attachmentId?: string; // 附加檔案 id
  fileId?: string; // 檔案絕對路徑
  fileName?: string; // 檔案名稱
  fileType?: string; // 檔案類型
  groupName?: string; // 檔案存放group位置
  size?: number; // 檔案大小
  width?: string; // 圖檔的寬度
  height?: string; // 圖檔的長度
  playTime?: string; // 語音消息時間 (秒)
};

export type TExtrasForward = {
  fromUserId?: string; // 轉發來源 userID
  fromUserName?: string; // 轉發來源者名稱
};
export type TExtrasRef = {
  refUserId?: string; // 回覆對象的 user ID
  refContent?: string; // 回覆消息內文
  refMsgId?: string; // 回覆消息 msg ID
  refMsgType?: string; // 回覆對象的消息類型
  refFile?: TExtrasRefFile; // 回覆檔案類型的聊天消息
  cancelStatus?: string; // 撤回狀態 0:未撤回 1:已撤回
  refVerify?: {
    element?: TElement; // 回覆「審批」訊息
  };
};
export type TExtrasRefFile = {
  refAttachmentId?: string; // 回覆對象的附加檔案 id
  refFileId?: string; // 回覆對象的檔案絕對路徑
  refFileName?: string; // 回覆對象的檔案名稱
  refFileType?: string; // 回覆對象的檔案類型
  refGroupName?: string; // 回覆對象的檔案存放group位置
};

export type TExtrasNotice = {
  noticeId?: string; // 公告 id
  title?: string; // 公告標題
  content?: string; // 公告內容
  lastUpdateTimestamps?: string; // 公告時間
  createUser?: string; // 發布者
};
export type TExtrasVerify = {
  verifyId?: string; // 審批 id
  verifyStatus?: string; // 審批狀態
  lastUpdateTimestamps?: string; // 最後更新時間
  element?: TElement; // 審批文案
  subElement?: TElement; // 審批子文案
};
export type TElement = {
  i18n?: string; // 該則訊息的 i18n 對應代碼
  contents?: TElementContent[]; // 該則訊息的內容
};

export type TElementContent = {
  content?: string; // 訊息內容
  user?: TElementContentUser; // 用戶訊息
};
export type TElementContentUser = {
  userId?: string; // 用戶 id
  realName?: string; // 用戶名稱
};

export type TExtrasGroup = {
  element?: TElement; // 群通知文案
};
export type TExtrasExport = {
  reportId?: string; // 匯報 id
  memo?: string; // 匯報內容
  element?: TElement; // 匯報通知文案
};
export type TExtrasTask = {
  taskId?: string; // 任務 id
  element?: TElement; // 任務通知文案
};
export type TExtrasProject = {
  projectId?: string; // 項目 id
  element?: TElement; // 項目通知文案
};
export type TExtrasVoice = {
  // todo 尚未規劃
};

export type TExtrasSurvey = {
  businessType: string;
  // 1,2-問卷開始 / 3-提交填答 / 4,5-修改填答 / 6-中止無效 / 7,8-問卷結束,中止有效
  element?: TElement;
  endTime: string;
  startTime: string;
  surveyId: string;
  surveyName: string;
};

// old v2 api extras
export type TOldExtras = {
  attachmentId: string;
  bottom: boolean;
  clientMark: string;
  createTime: string;
  fileId: string;
  fileName: string;
  fileType: string;
  groupName: string;
  size: number;
  toFavor: number;
  toUserId: number[];
  userAvatar: string;
  userName: string;
};
