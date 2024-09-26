import { TOption, TQueryData, TResponseData } from '@/types/baseType'
import { TNewExtras } from '@/types/extrasType'

// upload many item
export type TUpload = {
  failTotal: number
  list: { name: string; reason: string }[]
  name: string
  reason: string
  okTotal: number
  total: number
}
export type TUploadRes = TResponseData<TUpload>

export type TPostUpload = {
  attachmentId: string
  fileId: string
  fileName: string
  groupName: string
  height: number
  size: number
  width: number
}

// app
export type TAppStartImage = {
  num: number
  status: string
  url: string
}
export type TAppStartImageRes = TResponseData<TAppStartImage[]>

export type TSetAppStartImgPayload = TAppStartImage
export type TSetAppStartImgRes = TResponseData<null>

export type TUploadAppImageRes = TResponseData<TPostUpload>

// company
export type TCompanyDetail = {
  appCodeCheck: string
  avatarUrl: string
  name: string
}
export type TCompanyDetailRes = TResponseData<TCompanyDetail>

export type TPutCodeCheckPayload = {
  status: string
}
export type TPutCodeCheckRes = TResponseData<null>

export type TPostCompanyNameAvatarPayload = FormData
export type TPostCompanyNameAvatarRes = TResponseData<null>

//network
export type TGetNetworkPayload = {
  currentPage: number
  pageSize: number
  index: string // search keyword
  searchType: string
}

export type TNetwork = TQueryData<TNetworkListData[]>

export type TNetworkListData = {
  createDate: string
  createUser: string
  createUserName: string
  id: string
  macAddress: string
  memo: string
  user: string
}

export type TNetworkRes = TResponseData<TNetwork>

export type TEditNetworkPayload = {
  id: string
  memo: string
  user: string
}
export type TEditNetworkRes = TResponseData<null>

export type TAddNetworkPayload = {
  macAddress: string
  memo: string
  user: string
}
export type TAddNetworkRes = TResponseData<null>

export type TDelNetworkRes = TResponseData<null>

// overallEquipment
export type TGetOverallPayload = TGetNetworkPayload

export type TOverall = TQueryData<TOverallListData[]>

export type TOverallListData = {
  createDate: string
  createUser: string
  createUserName: string
  id: string
  uuid: string
  memo: string
  user: string
}

export type TOverallRes = TResponseData<TOverall>

export type TAddOverallPayload = {
  uuid: string
  memo: string
  user: string
}

// deviceMenu
export type TGetDevice = {
  clientType: string
  deviceDate: string
  deviceName: string
}
export type TGetDeviceRes = TResponseData<TGetDevice[]>

export type TGetDeviceTree = {
  children?: TGetDeviceTree[]
  isValid: boolean
  isShow: boolean
  menuCode: string
  menuId: string
  menuName: string
  parentId: string
  disabled?: boolean
}
export type TGEtDeviceTreeRes = TResponseData<TGetDeviceTree[]>

export type TGEtDeviceInitTreeRes = TResponseData<string[]>

export type TPutDeviceTreePayload = {
  clientType: string
  menuIds: string[]
}
export type TPutDeviceTreRes = TResponseData<null>

// ReportManagement
export type TGetReportTemplate = {
  enabledStatus: string
  id: string
  reportType: string
  showSwitch?: boolean
}

export type TGetReportTemplateRes = TResponseData<TGetReportTemplate[]>

export type TGetReportTemplateDetailRes = TResponseData<string>

export type TPostReportTemplateSwitchRes = TResponseData<boolean>

// role
export type TGetRoleListPayload = {
  currentPage: number
  pageSize: number
  roleName: string
}

export type TGetRole = TQueryData<TRoleList[]>

export type TRoleList = {
  createDate: string
  roleCode: string
  roleDesc: string
  roleId: string
  roleName: string
}

export type TGetRoleRes = TResponseData<TGetRole>

export type TGetRoleDefaultPermiss = {
  createDate: string
  menus: TGetRoleDetailTree[]
  roleCode: string
  roleDesc: string
  roleName: string
  roleDevice: TRoleDeviceData
}
export type TRoleDeviceData = {
  pc: boolean
  web: boolean
  app: boolean
}

export type TGetRoleDetail = {
  createDate: string
  menus: TGetRoleDetailTree[]
  roleCode: string
  roleDesc: string
  roleName: string
  roleDevice: TRoleDeviceData
}
export type TGetRoleDetailTree = {
  children?: TGetRoleDetailTree[]
  isValid: boolean
  menuCode: string
  menuName: string
  parentId: string
  roleId: number
}
export type TGetRoleDetailRes = TResponseData<TGetRoleDetail>
export type TGetDefaultRoleRes = TResponseData<TGetRoleDefaultPermiss>

export type TPostRolePayload = {
  menuIds: string[]
  roleName: string
  id: string
}

export type TPostRoleRes = TResponseData<null>

export type TDelRoleRes = TResponseData<null>

export type TAddRolePayload = {
  menuIds: string[]
  roleName: string
}

export type TAddRoleRes = TResponseData<string>

// position
export type TGetPositionPayload = {
  currentPage: number
  pageSize: number
  positionName: string
  deptType: string
}

export type TGetPosition = TQueryData<TPositionList[]>

export type TPositionList = {
  createDate: string
  createUser: string
  id: string
  isAllDept: boolean
  lastUpdateDate: string
  lastUpdateUser: string
  positionName: string
}

export type TGetPositionRes = TResponseData<TGetPosition>

export type TAddPositionRes = TResponseData<boolean>

export type TDelPositionRes = TResponseData<boolean>

export type IPostPositionPayload = {
  id?: string
  positionName: string
  isAllDept: boolean
}
export type IPostPositionRes = TResponseData<null>

// personnel
export type TGetPersonnelPayload = {
  currentPage: number
  pageSize: number
  deptIds?: string[]
  enabledStatus?: string
  roleId?: string
  search?: string
  workId?: string
}

export type TPersonnelList = {
  avatarUrl: string
  companyName: string
  deptCount: number
  email: string
  enabledStatus: string
  id: string
  isAdAccount: string
  isAdBlock: string
  positionId: string
  positionName: string
  positionNames: string[]
  realName: string
  roleId: string
  roleName: string
}
export type TPersonnel = TQueryData<TPersonnelList[]>

export type TGetPersonnelRes = TResponseData<TPersonnel>

export type TPostPersonnelSwitchPayload = {
  status: string
  id: string
  keyword: string
}
export type TPostPersonnelSwitchRes =
  TResponseData<TPostPersonnelEnableFailData | null>

export type TPostPersonnelEnableFailData = {
  avatarUrl: string
  ccUserTaskCopyVO?: any[]
  deptVO?: TDept[]
  id: string
  projectVO?: TProject[]
  realName: string
  receiveUserTaskVO?: TReceiveTask[]
  taskVo?: TTask[]
  userProjectVO?: TUserProject[]
  waitMeUserVerifyListVO?: TWaitMe[]
  verifyTemplateVO?: TReceiveTemplate[]
}

export type TReceiveTask = {
  createDate?: string
  createUser: number
  id: string
  isDelete: string
  lastUpdateDate?: string
  lastUpdateUser: number
  memo: string
  taskId: string
  taskName: string
  taskProgress: number
  userId: string
  version: number
}
export type TTask = {
  projectId: string
  subTasks?: []
  taskEndDate: string
  taskId: string
  taskName: string
  taskOwnAvatar: string
  taskOwnId: string
  taskOwnName: string
  taskProgress: number
  taskStartDate: string
  taskStatus: number
}
export type TUserProject = {
  avatarUrl: string
  id: string
  projectId: string
  projectName: string
  userId: string
  userName: string
}
export type TDept = {
  deptName: string
  deptOwnerId: string
  deptOwnerName: string
  id: string
  parentId: string
  parentName: string
  parentNameRecursion: string
}
export type TWaitMe = {
  finishDate: string
  startDate: string
  submitUserAvatarUrl: string
  verifyId: string
  verifyStatus: string
  verifySummary: string
  verifyTitle: string
  verifyType: string
}
export type TProject = {
  createDate: string
  createUser: string
  createUserName: string
  endDate: string
  id: string
  isCreateUser: string
  projectAcceptList?: []
  projectDesc: string
  projectName: string
  projectOwnerId: string
  projectProgress: string
  projectStatus: string
  projectType: string
  remindHour: number
  startDate: string
}
export type TReceiveTemplate = {
  createDate: string
  createUser: string
  deptPermissionStatus: string
  enabledStatus: string
  id: string
  isDelete: string
  lastUpdateDate: string
  lastUpdateUser: string
  memo: string
  templateAvatar: string
  templateId: string
  templateName: string
  verifyTemplateTypeId: string
  version: number
}

export type TGetPersonnelDetailV2 = {
  depts: TDeptVOS[]
  email: string
  enabledStatus: string
  isAdAccount: string
  isAdBlock: string
  isOnline: boolean
  positionIds: string[]
  realName: string
  roleId: string
  userId: string
  versionDetail: TVersionList
  createTimestamp: string
  createUser: string
  lastUpdateTimestamp: string
  lastUpdateUser: string
}
export type TVersionDetail = {
  clientType: string
  currentVersion: string
  description: string
  lowVersion: string
  status: string
  url: string
  flag: boolean
}

export type TVersionList = {
  android?: TVersionDetail
  ios?: TVersionDetail
  mac?: TVersionDetail
  windows?: TVersionDetail
}

export type TDeptVOS = {
  deptName: string
  deptOwnerId: string
  deptOwnerName: string
  id: string
  parentId: string
  parentName: string
  parentNameRecursion: string
}
export type TGetPersonnelDetailRes = TResponseData<TGetPersonnelDetailV2>

// personnel filter
export type TPostRoleOption = {
  createDate: string
  roleCode: string
  roleDesc: string
  roleMenuIdList?: null
  roleName: string
  roleId: string
}
export type TPostRoleOptionRes = TResponseData<TPostRoleOption[]>

export type TPostPositionOption = {
  createDate: string
  id: string
  positionName: string
  userId: number
}
export type TPostPositionOptionRes = TResponseData<TPostPositionOption[]>

export type TGetTreeManagement = {
  children?: TGetTreeManagement[]
  id?: string
  label?: string
  parentId?: string
  type?: string
  value?: string
  disabled?: boolean
  isLeaf?: boolean
}
export type TGetTreeManagementRes = TResponseData<TGetTreeManagement[]>

export type TGetTESTTreeOption = {
  children: TGetTESTTreeOption[]
  label: string
  value: string
  parentId: string
  parentName?: string
}

export type TGetV2TreeManagement = {
  children?: TGetV2TreeManagement[]
  id: string
  label: string
  parentId: string
  value?: string
}
export type TGetV2TreeManagementRes = TResponseData<TGetV2TreeManagement[]>

export type IPostUserLogoutRes = TResponseData<null>

export type IPostUserUpdateVersionPayload = {
  clientType: string
  userId: string
}
export type IPostUserUpdateVersionRes = TResponseData<null>

export type IEditPersonnelPayload = {
  deptIds: string[]
  email: string
  enabledStatus: string
  id: string
  isAdAccount: string
  isAdBlock: string
  realName: string
  roleId: string
  workIds: string[]
}
export type IEditPersonnelRes = TResponseData<null>

export type TResetPass = {
  email: string
  password: string
  realName: string
  userId: string
}
export type TResetPassRes = TResponseData<TResetPass>

export type TResetUUIDRes = TResponseData<null>

export type TAddPersonnelPayload = {
  avatarUrl: string
  deptIds: string[]
  email: string
  enabledStatus: string
  isAdAccount: string
  isAdBlock: string
  realName: string
  roleId: string
  workIds: string[]
}
export type TAddPersonnel = {
  email: string
  password: string
  realName: string
  userId: string
}

export type TAddPersonnelRes = TResponseData<TAddPersonnel>

export type TAddManyPersonnel = {
  failTotal: number
  list: { name: string; reason: string }[]
  okTotal: number
  total: number
  users: {
    email: string
    password: string
    realName: string
    userId: string
  }[]
}
export type TAddManyPersonnelRes = TResponseData<TAddManyPersonnel>

// approval
export type TPostAddVerifyType = TResponseData<null>

export type TGetVerifyTypeTableData = {
  createDate: string
  createUser: string
  id: string
  isDelete: string
  lastUpdateDate: string
  lastUpdateUser: string
  memo: string
  templateCount: number
  templateTypeAvatar: string
  templateTypeName: string
  unreadCount: number
  verifyTemplateVOS: TVerifyTemplateVOS[]
  version: number
}

export type TVerifyTemplateVOS = {
  createDate: string
  createUser: string
  deptPermissionStatus: string
  enabledStatus: string
  id: string
  isDelete: string
  lastUpdateDate: string
  lastUpdateUser: string
  memo: string
  templateAvatar: string
  templateId: string
  templateName: string
  verifyTemplateTypeId: string
  version: number
}

export type TGetVerifyTypeTableDataRes = TResponseData<
  TGetVerifyTypeTableData[]
>

export type TPostDelVerifyTypeRes = TResponseData<null>

export type TGetVerifyTemplatePayload = {
  keyWord: string
  currentPage: number
  pageSize: number
  verifyTemplateId?: string
  status?: number
  process?: string
  timeType?: string
  startDate?: string
  endDate?: string
}

export type TGetVerifyTemplateList = {
  createTimestamps: string
  deptNames?: string[]
  enabledStatus: string
  lastUpdateTimestamps: string
  templateId: string
  templateName: string
  users?: TUserList[]
  verifyTemplateTypeName: string
  scopeList?: string[]

  process: string
  originTimestamps?: string
  positionNames?: string[]
}
export type TUserList = {
  realName: string
  userId: string
}

export type TGetVerifyTemplate = TQueryData<TGetVerifyTemplateList[]>
export type TGetVerifyTemplateRes = TResponseData<TGetVerifyTemplate>

export type TPostEditVerifyTypeRes = TResponseData<null>

export type TPostDelVerifyTemplateRes = TResponseData<null>
export type TPostVerifyTemplateSwitchRes = TResponseData<null>

export type TGetTemplateByIDV4 = {
  allowChooseCopyTarget: string
  verifyLevelConditionFlowList: string
  copyTarget: string
  copyTargetDept: string
  copyTargetPosition: string
  deptId: number
  deptList: string
  exportUserIdList: string[]
  id: string
  isFiat: null
  isWriteOff: number
  memo: string
  positionList: string
  templateAvatar: string
  templateName: string
  userIdList: string
  verifyAdmin: string
  verifyLevelFlowList: string
  verifyTemplateElements: string
  verifyTemplateElementsValue: string
  verifyTemplateTypeId: string
  writeOffVerifyLevelConditionFlowList: string
  writeOffCopyTarget: string
  writeOffCopyTargetDept: string
  writeOffCopyTargetPosition: string
  writeOffVerifyLevelFlowList: string
}

export type TGetTemplateByIDV4Res = TResponseData<TGetTemplateByIDV4>

export type TPosAddTemplatePayload = {
  copyTarget: string // 抄送人信息 成員 [{userId: '', userName: ''}]
  deptList: string // 适用范围 選部門 [id]
  exportUserIdList: string[] // 数据汇出
  id: string
  templateAvatar: string // 模板图标
  templateName: string // 表單名稱
  userIdList: string // 适用范围 選人 [id]
  verifyAdmin: string // 管理員 [{ userId: '', userName: '' }]
  verifyLevelFlowList: string // 审批人信息 TStep3Verify
  verifyTemplateElements: string // 自定义表单信息 elementList
  verifyTemplateTypeId: string // 審批模版
  memo: string
}
export type TTemplatePayloadV2 = TPosAddTemplatePayload & {
  isWriteOff: number // 1 -> 開啟, 0 -> 關閉
  writeOffVerifyLevelFlowList: string // 核銷的审批人信息 TStep3Verify
  writeOffCopyTarget: string // 核銷的抄送人信息 [{userId: '', userName: ''}]
}
export type TTemplatePayloadV3 = TTemplatePayloadV2 & {
  positionList: string // 发起人崗位 [id]
  copyTargetPosition: string // 抄送人信息 崗位 [{id: '', name: ''}]
  copyTargetDept: string // 抄送人信息 部門 [{id: '', name: ''}]
  writeOffCopyTargetPosition: string // 核銷 抄送人信息 崗位 [{id: '', name: ''}]
  writeOffCopyTargetDept: string // 核銷 抄送人信息 部門 [{id: '', name: ''}]
}

export type TTemplatePayloadV4 = {
  verifyLevelConditionFlowList: string // 條件審批流程
  copyTarget: string // 抄送人信息 成員 [{userId: '', userName: ''}]
  copyTargetDept: string // 抄送人信息 部門 [{id: '', name: ''}]
  copyTargetPosition: string // 抄送人信息 崗位 [{id: '', name: ''}]
  deptList: string // 适用范围 選部門 [id]
  exportUserIdList: string[] // 数据汇出
  id: string
  isWriteOff: number // 1 -> 開啟, 0 -> 關閉
  memo: string
  positionList: string // 发起人崗位 [id]

  templateAvatar: string // 模板图标
  templateName: string // 表單名稱
  userIdList: string // 适用范围 選人 [id]
  verifyAdmin: string // 管理員 [{ userId: '', userName: '' }]
  verifyTemplateElements: string // 自定义表单信息 elementList
  verifyTemplateTypeId: string // 審批模版
  writeOffVerifyLevelConditionFlowList: string // 核銷 條件審批流程
}

export type TPostVerifyTemplateCreateRes = TResponseData<null>
export type TPostVerifyTemplateCopyRes = TResponseData<null>
export type TUnlockVerifyTemplateRes = TResponseData<null>

export type TPostVerifyNamePayload = {
  verifyTypeId: string
  key: string
  value: string
}

export type TUpdateFlow = {
  type: number
  status: number
  layer: number
  userIds: string[]
  replaceUserIds: string[]
}

export type TPostVerifyNameData = {
  errorList: object
  successList: object
  fail: number
  success: number
  key: string
  value: string
  verifyTemplateTypeName: string
}
export type TPostVerifyNameDataRes = TResponseData<TPostVerifyNameData>

export type TPostVerifyMemberPayload = {
  verifyTypeId: string
  verifyTemplateName: string
  verifyFlows: TUpdateFlow[]
}
export type TPostVerifyMember = {
  errorList: object
  fail: number
  success: number
  successList: object
  verifyFlows: TUpdateFlow[]
  verifyTemplateName: string
  verifyTemplateTypeName: string
}
export type TPostVerifyMemberRes = TResponseData<TPostVerifyMember>

export type TPostVerifyNameDataExportRes = TResponseData<null>
export type TPostVerifyMemberDataExportRes = TResponseData<null>

export type TGetUserTree = {
  children?: TGetUserTree[]
  id: string
  label: string
  parentId: string
  userTreeVOList: TUserTreeVoList[]
  disabled?: boolean
  isLeaf?: boolean
  lastUpdateTimestamps?: string
}
export type TUserTreeVoList = {
  avatarUrl: string
  groupId: string
  userId: string
  isLeader: boolean
  realName: string
  checked?: boolean
}
export type TGetUserTreeRes = TResponseData<TGetUserTree[]>

export type TVerifyPeoples = {
  userId?: string
  userName?: string
  userAvatarUrl?: string
}

export type TVerifySettingCard = {
  autoAdmin?: string // 0 -> 關, 1 -> 開
  autoPass?: string
  onePass?: string
  gradeCount?: string
  positionId?: string
  verifyFlow: string
  verifyPeople: TVerifyPeoples[]
}

export type TConditionCC = {
  copyTarget: { userId: string; userName: string }[]
  copyTargetPosition: { id: string; name: string }[]
  copyTargetDept: { id: string; name: string }[]
}
export type TStep3Verify = {
  autoAdmin?: string
  autoPass?: string
  gradeCount?: string
  layer?: string
  onePass?: string
  positionId?: string
  verifyFlow: string
  verifyPeople: TVerifyPeoples[]

  selfOption?: string
  verifyNameList?: string[]
  index?: number

  id?: string
  x?: number
  y?: number
  isCondition?: boolean
  source?: string[]
  target?: string
  indexInFlow?: number
  is_end?: boolean
  isTheLast?: boolean
  cardType?: string
  copyFlow?: TConditionCC
  isConditionEnd?: boolean
}

export type TFlowITem = {
  layer: string
  priority: string
  path: string // 條件在 step2 的位子

  condition: string
  value: string
  verifyFlowList: TStep3Verify[]
  copyFlow: TConditionCC

  pathName?: string // 條件在 step2 的名稱
  pathType?: string // 條件在 step2 的type
  id?: string
  x?: number
  y?: number
  isCondition?: boolean
  isElse?: boolean
  xIndex?: number
  source?: string[]
  target?: string
  indexInFlow?: number
  is_end?: boolean
  cardType?: string
  isConditionEnd?: boolean
}

export type TGetLeaderList = {
  adUid: string
  allowIosPush: string
  area: string
  avatarUrl: string
  birthday: string
  city: string
  companyName: string
  createDate: string | null
  createUser: number
  detailAddress: string
  email: string
  enabledStatus: string
  gender: string
  id: string
  isAdAccount: string
  isAdBlock: string
  isDelete: string
  isResetPassword: string
  lastUpdateDate: string | null
  lastUpdateUser: number
  loginPassword: string
  memo: string
  mobile: string
  province: string
  qq: string
  realName: string
  realNameShortWords: string
  realNameWords: string
  remark: string
  telephone: string
  version: number
  workId: number
}
export type TGetLeaderListRes = TResponseData<TGetLeaderList[]>

export type TGetGroupDetail = {
  dissolution: number
  forwardGroupCount: number
  forwardMessageCount: number
  groupTop: number
  numbers: number
  status: string
  top: number
}
export type TGetGroupDetailRes = TResponseData<TGetGroupDetail>

export type TChatSettingPayload = {
  dissolution: number
  groupTop: number
  numbers: number
  status: string
  top: number
}
export type TChatSettingRes = TResponseData<null>

export type TGetGroupList = {
  groupRoleId: string
  groupRoleName: string
  lastUpdateTimestamps: number // 純秒數 utc + 0 需再轉換
}
export type TGetGroupListRes = TResponseData<TGetGroupList[]>

export type TGetGroupRoleDetailRes = TResponseData<TGetDeviceTree[]>

export type TPutGroupRoleTreePayload = {
  groupRoleId: string
  menuIds: number[]
}
export type TPutGroupRoleTreeRes = TResponseData<null>

export type TGetHeaderExportList = {
  hotNotify: boolean
  notifyList: THeaderNotifyItem[]
}
export type THeaderNotifyItem = {
  createDate: string
  fileName: string
  fileType: number
  hotNotify: boolean
  i18n: string
  msgType: number
  status: number
  uuid: string
  exportFrom?: string
}
export type TGetHeaderExportListRes = TResponseData<TGetHeaderExportList>

export type TPostDownloadChatPayload = {
  startDate: string
  endDate: string
  leaderId: string
}

export type TGetSignPush = {
  password: string
  url: string
}
export type TGetSignPushRes = TResponseData<TGetSignPush>

export type TPostSignPushPayload = TGetSignPush
export type TPostSignPushRes = TResponseData<null>

export type TPostUploadRes = TResponseData<TPostUpload>

export type TPostCreateNoticePayload = {
  fileList?: TPostUpload[]
  noticeDesc: string
  noticeName: string
  noticePost: string[]
  noticeRange: string[]
  timerDate: string
  id?: string
}
export type TPostCreateNoticeRes = TResponseData<null>

export type TGetNoticeHistoryPayload = {
  startDate: string
  endDate: string
  title: string
}

export type TNoticeHistoryList = {
  createDate: string
  createUserName: string
  id: string
  lastUpdateDate: string
  noticeName: string
  noticeStatus: string
  scope: string
  timerDate: string
}
export type TGetNoticeHistoryListRes = TResponseData<TNoticeHistoryList[]>

export type TGetNoticeById = {
  createDate: string
  createUser: string
  createUserName: string
  fileList?: TPostUpload[]
  id: string
  isDelete: string
  isTimer: string
  lastUpdateDate: string
  lastUpdateUser: string
  noticeDesc: string
  noticeName: string
  noticePost: string[]
  noticeRange: string[]
  noticeStatus: string
  timerDate?: string
}
export type TGetNoticeByIdRes = TResponseData<TGetNoticeById>
export type TDelNoticeByIdRes = TResponseData<null>

export type TGetUpdateVersion = {
  clientType: string
  currentVersion: string
  description: string
  lowVersion: string
  status?: string
  url: string
}
export type TGetUpdateVersionRes = TResponseData<TGetUpdateVersion[]>

export type TUploadAPPFile = {
  name: string
  percentage: number
  raw: {
    uid: number
    lastModified: number
    lastModifiedDate: Date
    name: string
    size: number
    type: string
    webkitRelativePath: string
  }
  size: number
  status: string
  uid: number
}

export type TPostVersionNotifyPayload = {
  clientType: number
  isLite: string
  isMac: string
  userId: number
}
export type TPostVersionNotifyRes = TResponseData<null>

export type TPostVersionRes = TResponseData<TGetUpdateVersion>

export type TPostVersionPayload = TGetUpdateVersion

export type TPostUploadLargeFile = {
  attachmentId: string
  fileId: string
  fileName: string
  groupName: string
  height: number
  size: number
  width: number
}
export type TPostUploadLargeFileRes = TResponseData<TPostUploadLargeFile>

export type TGetDeptAsideTreeRes = TResponseData<TGetTreeManagement[]>

export type TDeptAreaAndTag = {
  name: string
  id: string
}
export type TGetUserChatHistory = {
  isBegin: boolean
  isEnd: boolean
  messages: TMessage[]
}
export type TMessage = {
  cancelStatus: number
  chatMessage: string
  createDateTimestamps: string
  extras: TNewExtras
  fromId: string // 不是監控的的id 就是別人 pop放左邊
  groupId: string // 聊天室 id
  isFavor: number
  msgId: string
  msgType: number
  sort: number
  taggedUserId: string
  isDelete: string
  deleteVisible?: boolean
  revokeUserId: string | number
}

export type TGetUserChatHistoryRes = TResponseData<TGetUserChatHistory>

export type TGetUserChatRightTabValuePayload = {
  tabName: string
  groupId: string
  page: number
  size: number
  admin: boolean
}
export type TGetUserChatRightTabValueList = {
  chatMessage: string
  createDateTimestamps: string
  extras: TNewExtras
  fromId: string
  msgId: string
  msgType: number
}
export type TGetUserChatRightTabValueData = TQueryData<
  TGetUserChatRightTabValueList[]
>

export type TGetUserChatRightTabValueRes =
  TResponseData<TGetUserChatRightTabValueData>

export type TGetRightValueV2 = {
  chatMessage: string
  createDateTimestamps: string
  fromId: string
  msgId: string
  extras: TNewExtras
  msgType: number
  sort: number
}

export type TGetRightValueV2Res = TResponseData<TGetRightValueV2[]>

export type TGetGroupMembers = {
  avatarUrl: string
  id: string
  isDisabledTalk: string
  isDisabledUser: string
  isGroupOwner: string
  isManager: string
  realName: string
}
export type TGetGroupMembersRes = TResponseData<TGetGroupMembers[]>

export type TGetSearchMessagePayload = {
  k: string
  groupId: string
}

export type TGetSearchMessage = {
  extras: TNewExtras
  fromId: string
  id: string
  message: string
  messageTimestamps: string // note 格式給字串要轉成數字再套時間fun 才會正確
  msgType: number
}
export type TGetSearchMessageRes = TResponseData<TGetSearchMessage[]>

export type TGetSkipMessagePayload = {
  msgId: string
  groupId: string
  count: number
}

export type TGetDatePickMessagePayload = {
  startDate: string
  groupId: string
}
export type TGetDatePickMessage = {
  dateMsgId: number
  isBegin: boolean
  isEnd: boolean
  messages: TMessage[]
}
export type TGetDatePickMessageRes = TResponseData<TGetDatePickMessage>

export type TGetGroupInfo = {
  adminInvestStatus: string
  adminName: string
  allReadDate?: any
  allReadTime: number
  friendId: number
  groupAvatar: string
  groupCode: string
  groupManagerCount: number
  groupName: string
  groupNotice: string
  groupStatus: string
  id: string
  isAdmin: number
  isDisabledTalk: number
  isManager: number
  isShowGroupNotice: number
  isTop: number
  memberCount: number
  onlineMemberCount: number
  projectId: number
  projectName: string
  receiveType: number
  unreadCount: number
}
export type TGetGroupInfoRes = TResponseData<TGetGroupInfo>

export type TGroupTask = {
  processUsers: {
    avatarUrl: string
    memo: string
    taskProgress: number
    userId: string
    userName: string
  }
  taskId: string
  taskName: string
  taskOwnerId: string
  taskProgress: number
  taskStatus: string
}
export type TGroupTaskRes = TResponseData<TGroupTask[]>

export type TProjectList = {
  createDate: string
  createUser: string
  createUserName: string
  endDate: string
  id: string
  isCreateUser: string
  projectAcceptList: [] // note 不知道是什麼
  projectDesc: string
  projectName: string
  projectOwnerId: string
  projectProgress: string
  projectStatus: string
  projectType: string
  remindHour: number
  startDate: string
}
export type TProjectListRes = TResponseData<TProjectList[]>

export type TGetAfterMessagePayload = {
  groupId: string
  msgId: string
  count: number
}
export type TGetBeforeMessagePayload = TGetAfterMessagePayload

export type TGetBefore = {
  isBegin: boolean
  messages: TMessage[]
}
export type TGetAfter = {
  isEnd: boolean
  messages: TMessage[]
}
export type TGetBeforeRes = TResponseData<TGetBefore>
export type TGetAfterRes = TResponseData<TGetAfter>

export type TGetUserAccount = {
  email: string
  id: string
}
export type TGetUserAccountRes = TResponseData<TGetUserAccount[]>

export type TPostChatRoomPayload = {
  groupType?: string
  projectId?: string
  groupName?: string
  ownerId?: string
  startDate?: string
  endDate?: string
}
export type TPostChatMemberPayload = {
  groupType?: string
  userIds?: string[]
  key?: string
  startDate?: string
  endDate?: string
}
export type TPostChatRoomExportPayload = {
  groupType: string
  projectId: string
  groupName: string
  ownerId: string
  startDate: string
  endDate: string
  hasInvalidGroup: boolean
  /*
   * true: 不過濾群組
   * false: 只過濾掉「已解散」群組
   * */
  hasSystemFriend: boolean
  /*
   * true: 不過濾群組
   * false: 只過濾「助手」群組
   * */
}

export type TPostChatMemberExportPayload = {
  groupType: string
  userIds: string
  key: string
  startDate: string
  endDate: string
  hasInvalidGroup: boolean
  //true: 不過濾群組
  // false: 只過濾掉「已解散」群組
  hasSystemFriend: boolean
  //true: 不過濾群組
  // false: 只過濾「助手」群組
}

export type TMonitorFilterType = {
  groupType: string
  dateTimeRange: Date[]

  projectId: string
  groupName: string
  ownerId: string

  key: string
  userIds: string[]

  groupStatus: boolean
  // 0:未解散, 1:已解散
  memberStatus: boolean
  // 0:未退出, 1:已退出
  /**
   * 0:未解散, 1:已解散
   ＊改由 WEB filter 處理
   */
  isSystemFriend: boolean
  // 四大天王
}

export type TGetSurveyQuestPayload = {
  quesTitle: string
  creator: string
  currentPage: number
  pageSize: number
}
export type TGetSurveyQuestDetail = {
  completeCount: number
  creator: string
  creatorType: number
  deptId: string
  deptName: string
  endTime: string
  quesDesc: string
  quesId: string
  quesStatus: number
  quesTag: number[]
  quesTagString: string
  quesTitle: string
  startTime: string
  totalCount: string
  ansUrl: string
  creatorId: string
  isAnonymous?: boolean
  isAns?: boolean
  isModify?: boolean
  quesAns?: []
  quesContent?: {
    parts: TPart[]
  }
  respondent?: {
    userIds: string[]
    deptIds?: string[]
    groupIds?: string[]
  }
  statisticsType: number
  statisticsUrl: string
}

export type TGetSurveyQuestDetailRes = TResponseData<TGetSurveyQuestDetail>

export type TGetSurveyQuest = {
  completeCount: number
  creator: string
  creatorType: number
  deptId: string
  deptName: string
  endTime: string
  quesDesc: string
  quesId: string
  quesStatus: number
  quesTag: number[]
  quesTagString: string
  quesTitle: string
  startTime: string
  totalCount: string
  dateTime?: TOption
  ansUrl: string
  creatorId: string
  isAnonymous?: boolean
  isAns?: boolean
  isModify?: boolean
  quesAns?: []
  quesContent?: {
    parts: TPart[]
  }
  respondent?: {
    userIds: string[]
  }
  statisticsType: number
  statisticsUrl: string
}
export type TGetSurveyQuestList = {
  list: TGetSurveyQuest[]
  total: number
  currentPage: number
  pageSize: number
}
export type TGetSurveyQuestRes = TResponseData<TGetSurveyQuestList>

export type TPostCopyQuestPayload = {
  quesId: string
  isCopy: boolean
  quesTitle: string
}
export type TPostCopyQuestRes = TResponseData<null>

export type TPostDelQuestRes = TResponseData<null>

export type TPostQuestEarlyFinishPayload = {
  quesId: string
  isEffective: boolean
}
export type TPostQuestEarlyFinishRes = TResponseData<null>

export type TCreateQuestPayload = {
  quesId?: string
  quesTitle: string
  quesDesc: string
  startTime: string
  endTime: string
  isModify: boolean
  isAnonymous: boolean
  creatorId: string
  creator: string
  statisticsType: number
  creatorType: number
  respondent: {
    userIds: string[]
  }
  quesContent: {
    parts: TPart[]
  }
}
export type TCreateQuestRes = TResponseData<null>

export type TPart = {
  partId: number
  partType: string
  partTitle: string
  partDesc: string
  partTitleAlign: number
  partTitleColor: string
  partTitleSize: number
  partDescAlign: number
  partDescColor: string
  partLineDisplay: number
  partLineType: number
  partLineColor: string
  partPicPosition: number
  partDescFileName: string
  partDescGroupName: string
  partDescFileId: string
  subjects: TSubject[]
}
export type TSubject = {
  subId: number
  subTitle: string
  subDesc: string
  subDescFileName: string
  subDescGroupName: string
  subDescFileId: string
  subType: number
  subIsRequire: boolean
  opIsSingle: boolean
  optionMin: number
  optionMax: number
  options: TSubjectOption[]
  dropDowns: TSubjectDrowns[]
  dateFormatType: string
  shortAnsType: string
}

export type TSubjectOption = {
  opId: number
  opType: number
  opItem: string
  opFileName: string
  opGroupName: string
  opFileId: string
}
export type TSubjectDrowns = {
  dropId: number
  dropType: number
  dropItem: string
}

export type TBeforeSetPart = {
  partId?: number
  type: string
  name: string
  partTitleAlign: number
  partTitleSize: number
  partTitleColor: string
  partDescAlign: number
  partDescColor: string
  partLineDisplay: number
  partLineType: number
  partLineColor: string
  partPicPosition: number
  partTitle: string
  partDesc: string
  partDescFileName: string
  partDescGroupName: string
  partDescFileId: string
  subjectList: TBeforeSetSubject[]
  centerIndex?: number
}
export type TBeforeSetSubject = {
  type: number
  apiKey: string
  name: string
  optionMin: number
  optionMax: number
  options: TBeforeSubjectOption[]
  subIsRequire: boolean
  opIsSingle: boolean
  subTitle: string
  subDesc: string
  subDescFileName: string
  subDescGroupName: string
  subDescFileId: string
  shortAnsType: string
  dateFormatType: string
  subId?: number
  centerIndex?: number
}
export type TBeforeSubjectOption = {
  opType: number
  opItem: string
  opFileName?: string
  opGroupName?: string
  opFileId?: string
  opId?: number
}

export type TChatRoomData = {
  groupType: string
  groupId: string
  groupName: string
  memberCount: number
  ownerName: string
  groupStatus: string
  memberStatus: string
  lastUpdateTime: string
  ownerEmail: string
  isSystemFriend: boolean
}
export type TChatRoomListRes = TResponseData<TChatRoomData[]>

export type TTaskDetail = {
  createTimestamps: string
  createUserId: string
  createUserName: string
  endTimestamps: string
  groupName: string
  ownerUserId: string
  ownerUserName: string
  projectName: string
  remindDate: string
  startTimestamps: string
  taskMemo: string
  taskName: string
  taskProgress: number
}
export type TNoticeDetailPayload = {
  type: string
  noticeId: string
}

export type TTaskDetailRes = TResponseData<TTaskDetail>

export type TProjectDetail = {
  createTimestamps: string
  endTimestamps: string
  id: string
  ownerUserId: string
  ownerUserName: string
  projectAcceptList: TProjectAcc[]
  projectName: string
  projectProgress: string
  projectStatus: string
  projectType: string
  remindHour: number
  startTimestamps: string
}

export type TProjectAcc = {
  avatarUrl: string
  userId: string
  userName: string
}
export type TProjectDetailRes = TResponseData<TProjectDetail>

export type TReportDetail = {
  attachmentList: TAttachmentItem[]
  comments?: any
  copyUserList: TCopyUserListItem[]
  createTimestamps: string
  reportContent: string
  reportUserAvatarUrl: string
  reportUserId: string
  reportUserName: string
  taskList: []
}
export type TAttachmentItem = {
  attachmentGroupName: string
  attachmentId: string
  attachmentName: string
  attachmentPath: string
  attachmentSize: number
}
export type TCopyUserListItem = {
  avatarUrl: string
  userId: string
  userName: string
}

export type TReportDetailRes = TResponseData<TReportDetail>

export type TVerifyExportFilterPayload = {
  deptId: string
  verifyTemplateIds: string[]
  verifyStatusList: string[]
  timeType: string
  startDate: string
  endDate: string
  verifyPeoples: string[]
  key: string
  hasMemo: boolean
  orderByAsc: boolean
  fileType: number
  filterDeptIds: string[]
}
export type TVerifyExportRecordPayload = {
  orderByAsc: boolean
  currentPage: number
  pageSize: number
}

export type TVerifyNameTree = {
  children?: TVerifyNameTree[]
  label: string
  value: string
}

export type TVerifyExportRecord = {
  createDate: string
  exportCount: string
  exporter: string
  fileName: string
}
export type TVerifyExportTable = {
  currentPage: number
  pageSize: number
  total: number
  list: TVerifyExportRecord[]
}
export type TVerifyExportTableRes = TResponseData<TVerifyExportTable>

export type TPlatFormFilter = {
  platName: string
  opUserIds: string[]
  deptIds: string[]
  enabledStatus: number
}
export type TPlatFormPayload = {
  currentPage: number
  pageSize: number
} & TPlatFormFilter

export type TPlatformRow = {
  platName: string
  deptNames: TDeptVOS[]
  opUserIdNames: TUserList[]
  lastUpdateDate: string
  lastUpdateUser: TUserList[]
  enabledStatus: number
  platId: string
  memo: string
}

export type TPlatformRowRes = TResponseData<TQueryData<TPlatformRow[]>>

export type TUpdatePlatformStatusPayload = {
  enabledStatus: number
  platId: string
}

export type TPlatformOperatePayload = {
  platId?: string
  platName: string
  enabledStatus: number
  opUserIds: string[]
  deptIds: string[]
  memo: string
}

export type TNewDeptFilterPayload = {
  areaId: string
  platId: string
  tagId: string
}
export type TRowData = TNewDept & TDeptTablePluginValue

export type TNewDept = {
  children: TRowData[]
  createDate: string
  createUser: string
  deptArea: { id: string; name: string }
  deptId: string
  deptName: string
  deptOwnerId: string
  deptOwnerName: string
  deptTags: { id: string; name: string }[]
  memo: string
  parentId: string
  platforms: TDeptPlatform[]
  updateDate: string
  updateUser: string
  parentNameRecursion: string
}
export type TDeptTablePluginValue = {
  areaName?: string
  tagNames?: string[]
  platformNames?: string[]
  hasChildren?: boolean
}

export type TNewAddAndEditDeptPayload = {
  deptId?: string // 有給是編輯 沒給是新增
  areaId: string
  deptName: string
  parentId: string
  tagIds: string[]
  platIds: string[]
  deptOwnerId?: string
  memo: string
}

export type TDeptPlatform = {
  enabledStatus: string // 0啟用 // 1關閉
  id: string
  platName: string
}

export type TFlowNode<T> = {
  id: string
  type: string
  data: T
  events: {}
  selected: boolean
  resizing: boolean
  dragging: boolean
  connectable: boolean
  position: {
    x: number
    y: number
    z: number
  }
  dimensions: {
    width: number
    height: number
  }
  zIndex: number
}
