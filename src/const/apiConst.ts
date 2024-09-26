export enum EApiPaths {
  // 菜單權限
  queryTree = '/oa/auth/menu/list', //auth

  // user
  login = '/oa/auth/user/login', // auth
  changePassword = '/oa/cms/user/resetP',
  managerUser = '/oa/auth/user/manager/login', // 管理員二次登入

  // app
  getAppStartImg = '/oa/cms/parameter/appIndexQueryAll',
  setAppStartImgStatus = '/oa/cms/parameter/appIndexStatus',
  uploadImage = 'oa/fs/file/upload',

  // company
  getCorporationDetail = '/oa/cms/corporation/detail',
  putTelephoneSwitch = '/oa/cms/parameter/switchAppCode',
  postCompanyAvatarUrlName = '/oa/cms/corporation/modify',

  // network
  getNetwork = '/oa/cms/device/query',
  editNetwork = '/oa/cms/device/edit',
  addNetwork = '/oa/cms/device/add',
  delNetwork = '/oa/cms/device/delete',
  uploadManyNetwork = 'oa/cms/device/import', // 批量添加

  // overallEquipment
  getOverall = '/oa/cms/uuid/query',
  editOverall = '/oa/cms/uuid/edit',
  addOverall = '/oa/cms/uuid/add',
  delOverall = '/oa/cms/uuid/delete',
  uploadManyOverall = '/oa/cms/uuid/import',

  // deviceMenu
  getDeviceMenuList = '/oa/auth/deviceMenu/list', // auth
  getDeviceTree = '/oa/auth/deviceMenu/tree/', // auth
  putDeviceTree = '/oa/auth/deviceMenu/modify', // auth
  getDeviceDefaultList = '/oa/auth/deviceMenu/defaultSetting/', // auth

  // ReportManagement
  getReportTemplate = '/oa/cms/reportTemplate/queryAll',
  getReportTemplateDetail = '/oa/cms/reportTemplate/detail/',
  putReportTemplateSwitch = '/oa/cms/reportTemplate/enabled/',

  // role management
  getRoleList = '/oa/auth/role/query', // auth
  getRoleDetail = '/oa/auth/role/detail/', // auth
  editRole = '/oa/auth/role/modify', // auth
  removeRole = '/oa/auth/role/remove/', // auth
  addRole = '/oa/auth/role/create', // auth
  getDefaultRolePermiss = '/oa/auth/roleMenu/default', // auth

  // position
  getPosition = '/oa/cms/position/query',
  addPosition = '/oa/cms/position/save',
  removePosition = '/oa/cms/position/remove/',
  editPosition = '/oa/cms/position/modify',

  // personnel
  getPersonnelData = '/oa/cms/user/query',
  postModifyAppShare = '/oa/cms/user/modifyAppShare', // 外部分享 status
  postModifyApp = '/oa/cms/user/modifyApp', // 主管权限 status 沒有主管權限 外部分享要 disable
  postEnabledStatus = '/oa/cms/user/modifyEnabledStatus', // enabledStatus 启用状态
  getPersonnelDetail = '/oa/cms/V2/user/detail/',
  getAllRole = '/oa/auth/role/queryAll', // 角色 get // auth
  getAllPosition = '/oa/cms/position/queryAll', // 崗位 post
  getTreeManagement = 'oa/cms/dept/tree', // 部门管理树 get
  postUserForcedLogout = '/oa/cms/user/forcedLogout', // 強制下線
  postUserUpdateVersion = '/oa/cms/parameter/versionNotify', // 版更提醒
  postEditPersonnel = '/oa/cms/user/modify', // 編輯資訊
  postDelPersonnel = '/oa/cms/user/remove', // 刪除人員
  postResetPassword = '/oa/cms/user/manager/resetP/', // 重置密碼
  postResetUUID = '/oa/auth/user/resetAppCode', // 重置手机识别码 // auth
  postAddPersonnel = '/oa/cms/user/save', // 添加人員
  postAddManyPersonnel = '/oa/cms/user/import', // 添加很多人員
  getDeptV2Tree = '/oa/cms/V2/dept/tree',

  // approval
  addApproval = '/oa/cms/verifyTemplateType/addVerifyTemplateType', // 新建單個類型
  getVerifyTypeData = '/oa/cms/verifyTemplateType/getAllVerifyTemplateType', // 審批類型設置 table data
  delVerifyType = 'oa/cms/verifyTemplateType/deleteVerifyTemplateType', // 刪除審批類型
  editVerifyType = 'oa/cms/verifyTemplateType/editVerifyTemplateType', // 編輯審批類型
  getVerifyTemplate = '/oa/cms/V4/verifyTemplate/custom/query', // 自定義表單 table data
  delVerifyTemplate = 'oa/cms/V2/verifyTemplate/deleteVerifyTemplate', // 刪除自定義類型
  postEnableSwitch = '/oa/cms/V2/verifyTemplate/enableOrDisableVerifyTemplate', // 自定義類型啟用
  postCopyVerifyTemplate = 'oa/cms/verifyTemplate/copyVerifyTemplate', // copy 自定義類型
  getVerifyTemplateByIdV4 = '/oa/cms/V4/verifyTemplate/getWebVerifyTemplateContentById', // 取得指定模板資料 (編輯)
  postEditVerifyTemplate = '/oa/cms/verifyTemplate/editVerifyTemplateContentById', // 送出編輯自定義表單
  unlockVerifyTemplate = '/oa/cms/verifyTemplate/editBack/', // 解鎖「編輯」(call getVerifyTemplateById) 的審批單
  /* note
   * 解鎖條件:
   * 1. 離開編輯表單
   * */

  // create approval (verify template)
  getUserTree = 'oa/cms/V2/dept/admin/queryDeptAndUserTree',
  postCreateVerifyTemplate = '/oa/cms/verifyTemplate/addVerifyTemplate', // 新增自定義類型

  // approval update
  postVerifyNameUpdate = 'oa/cms/verifyTemplate/editMultiName',
  postVerifyNameExport = 'oa/cms/verifyTemplate/genMultiNameExport',
  postVerifyMultipleMember = 'oa/cms/verifyTemplate/editMultiTemplate',
  postVerifyMultipleMemberExport = 'oa/cms/verifyTemplate/genMultiTemplateExport',

  // approval export table data
  postVerifyExportDept = 'oa/cms/V2/userVerify/export',
  postVerifyExportRecord = 'oa/cms/V2/userVerify/export/queryRecord',

  // chat set
  getAllLeaderOption = '/oa/cms/dept/getAllLeaderData',
  getGroupDetail = 'oa/cms/parameter/groupDetail',
  postChatSetting = 'oa/cms/parameter/groupSetting',
  getGroupRoleList = 'oa/auth/groupRole/queryDefaultList', // auth
  getGroupRole = 'oa/auth/groupRoleMenu/query', // auth
  putGroupRoleTree = 'oa/auth/groupRoleMenu/modify', // auth

  // ios sign push
  getPushKey = 'oa/cms/parameter/iosPushKeySertting',

  // notice
  createNotice = 'oa/cms/V2/notice/createNotice',
  getAllNotice = 'oa/cms/V2/notice/getNoticeList',
  getNoticeById = 'oa/cms/V2/notice/getNoticeById/',
  delNotice = 'oa/cms/notice/deleteNotice/',
  postEditNotice = 'oa/cms/V2/notice/saveNotice',

  // version SetUpdate
  getVersionQuery = 'oa/cms/parameter/versionQuery',
  getVersionLite = 'oa/cms/parameter/versionQuery/lite',
  postVersionPcLite = '/oa/cms/parameter/setVersion/lite',
  postVersion = '/oa/cms/parameter/setVersion',
  postLargeFile = '/zuul/oa/fs/file/upload',

  // Depart Management
  postDelDepart = '/oa/cms/dept/remove',
  getDeptTree = 'oa/cms/dept/queryDeptTypeUserTree',
  getAreaAndTag = 'oa/cms/V2/dept/queryDeptParam/',
  getDeptPlatform = 'oa/cms/platform/queryPlatform',
  delAreaTag = 'oa/cms/V2/dept/deleteDeptParam',
  editAreaTag = 'oa/cms/V2/dept/createDeptParam',
  postDeptTable = 'oa/cms/V2/dept/query',
  postUpdateDept = 'oa/cms/V2/dept/saveOrUpdate',

  // monitor chat
  getUserChatHistory = 'oa/cms/V4/message/admin/recent', // 聊天監控 - 最近N条聊天记录
  getUserChatRight = 'oa/cms/V2/message/msgType', // 聊天監控 - 右邊欄位 圖片檔案
  getGroupMemberDetail = 'oa/cms/V3/group/admin/getGroupMember', // 聊天監控 - 查詢群成員
  getSearChMessage = 'oa/cms/V2/search/searchMessage', // 聊天監控 - 搜尋訊息
  getCollect = 'oa/cms/V3/userFavoriteMessage/queryUserGroupFavoriteMessagePage', // 聊天監控 - 查看收藏訊息
  getSkipMessage = '/oa/cms/V4/message/admin/skip', // 跳躍到某條訊息
  getPickerDateMessage = 'oa/cms/V3/message/admin/date', // 日期搜尋訊息
  getGroupInfoData = 'oa/cms/group/admin', // 群公告
  getGroupTask = 'oa/cms/V2/task/group', // 群任務
  getBeforeMes = 'oa/cms/V4/message/admin/before', // 之前的訊息
  getAfterMes = 'oa/cms/V4/message/admin/after', // // 之後的訊息
  delMessage = '/oa/cms/message/admin/delete',
  getUserList = 'oa/cms/search/admin/userList', // 監控人員可看到的有限名單
  postFilterChatRoom = 'oa/cms/search/admin/group/list',
  postFilterChatMember = 'oa/cms/search/admin/user/list',
  getChatRoomExport = 'oa/cms/search/admin/group/export',
  getChatMemberExport = 'oa/cms/search/admin/user/export',
  getNotifyDetail = 'oa/cms/V2/notice/query',

  // group Management
  getProject = 'oa/cms/project/queryAll', // group filter

  // survey quest
  questList = 'oa/survey/manage/questionnaire/queryQuesList',
  postQuestCopy = 'oa/survey/manage/questionnaire/copy',
  postQuestDel = 'oa/survey/manage/questionnaire/delete',
  postQuestEarlyFinish = 'oa/survey/manage/questionnaire/earlyFinish',
  postQuestCreate = 'oa/survey/manage/questionnaire/create',
  getQuestDetail = 'oa/survey/manage/questionnaire/queryQuesDetail',
  postQuestUpdate = 'oa/survey/manage/questionnaire/update',

  // header export list
  getHeaderBell = 'oa/cms/notice/admin/list',
  setInExportList = 'oa/cms/activity/async/export',
  getExportFile = 'oa/cms/user/getAdminExport',

  //platform
  queryPlatform = 'oa/cms/platform/query',
  addPlatform = 'oa/cms/platform/create',
  updatePlatform = 'oa/cms/platform/update',
  deletePlatform = 'oa/cms/platform/delete',
  updatePlatformStatus = 'oa/cms/platform/updatePlatformEnabledStatus'
}
