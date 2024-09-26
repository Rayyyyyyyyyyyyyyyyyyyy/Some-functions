import { TResponseData } from '@/types/baseType'

export type TLoginPayload = {
  username: string
  password: string
}
export type TLogin = {
  bindingSuccess: boolean
  cacheData: string[]
  canDeleteMessage: boolean
  isAdAccount: string
  isAdBlock: string
  isSystemManager: boolean // 需要使用二次登入機智的帳號帳號
  leftMenus: TLeftMenu[]
  menus: string[]
  remark: string
  soundSettingStatus: string
  name: string
  token: string
  user: userInfo
}

export type TNewPermission = {
  leftMenus: TLeftMenu[]
  menus: string[]
}

export type TGetNewPermissionRes = TResponseData<TNewPermission>

export type TLeftMenu = {
  children?: TLeftMenu[]
  menuCode: string
  menuIcon: string
  menuId: string
  menuName: string
  menuUrl: string
  parentId: string
}

export type userInfo = {
  hideMsg: string
  isResetPassword: string
  realName: string
  role: TRole
  shake: string
  silent: string
  silentEndTime: string
  silentStartTime: string
  sound: string
  userAvatar: string
  userId: string
  voice: string
  voiceStatus: number
}
export type TRole = {
  id: string
  roleCode: string
  roleDesc: string
  roleName: string
}

export type TLoginResponse = TResponseData<TLogin>
export type TSecondLoginResponse = TResponseData<null>

export type TChangePasswordPayload = {
  oldPassword: string
  newPassword: string
}
