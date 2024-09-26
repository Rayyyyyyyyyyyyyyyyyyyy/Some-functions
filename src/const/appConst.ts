// @ts-ignore
import { TFlowITem } from '@/types/apiTypes'

//@ts-ignore
export const uploadUrl = `${import.meta.env.VITE_RES_URL}/oa/fs/file/upload`

// add personnel default avatar Url
export const defaultAvatarUrl = '/wap/imgOA/icon_default_avatar.png'

// 語言切換選項
export const langOptions = [
  { text: '中文', value: 'zh' },
  { text: 'English', value: 'en' }
]

// 全局设置 - 网卡管理
export const networkCardOption = [
  { id: '1', value: '网卡位址' },
  { id: '2', value: '备注' },
  { id: '3', value: '使用人' },
  { id: '4', value: '新增人' }
]
// 全局设置 - 设备管理
export const overallOption = [
  { id: '1', value: '设备编码' },
  { id: '2', value: '备注' },
  { id: '3', value: '使用人' },
  { id: '4', value: '新增人' }
]

// 人員管理 - 状态
export const enabledOption = [
  { id: '', value: '全部' },
  { id: '0', value: '启用' },
  { id: '1', value: '停用' }
]

export const createVerifyStep = [
  {
    step: 1,
    name: '表单基础设置'
  },
  {
    step: null,
    name: '-'
  },
  {
    step: 2,
    name: '表单自定义'
  },
  {
    step: null,
    name: '-'
  },
  {
    step: 3,
    name: '申请流程设置'
  },
  {
    step: null,
    name: '-'
  },
  {
    step: 4,
    name: '核销流程设置'
  }
]
export const createQuestStep = [
  {
    step: 1,
    name: '问卷設計'
  },
  {
    step: null,
    name: '-'
  },
  {
    step: 2,
    name: '预览与设置'
  }
]

// tree data
export const defaultProps = {
  children: 'children',
  label: 'menuName'
}
export const approvalProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled'
}

export const gradeCountOptions = [
  {
    label: '不指定',
    value: '0'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  }
]

export enum messageType {
  WS_MSG_TYPE_CANCEL = -1, // 撤销的消息
  WS_MSG_TYPE_TEXT = 0, // 文本
  WS_MSG_TYPE_PIC = 1, // 图片
  WS_MSG_TYPE_AUDIO = 2, // 语音
  WS_MSG_TYPE_VIDEO = 3, // 视频
  WS_MSG_TYPE_FILE = 4, // 文件
  WS_MSG_TYPE_FRIEND = 5, // 朋友名片
  WS_MSG_TYPE_NOTICE = 6, // 無流水號的通知（四大天王用）
  WS_MSG_TYPE_WARNING = 7, // 系统警告的消息 群提示性文字类型
  WS_MSG_TYPE_TEL = 8, // 通话
  WS_NOTICE_TYPE_TIPS = 9, // 提示性消息
  WS_MSG_TYPE_NOTICE_WITH_SORT = 11, // 有流水號的通知（聊天室用）
  WS_MSG_TYPE_MP3 = 12, // 音頻
  WS_MSG_TYPE_NOT_PREVIEWABLE_FILE = 13 // 不可預覽文件
}

export enum ENoticeType {
  WS_NOTICE_TYPE_APPROVE = 1, // 审批
  WS_NOTICE_TYPE_ANNOUNCEMENT = 2, // 公告
  WS_NOTICE_TYPE_DAY_DAILY = 3, // 日报
  WS_NOTICE_TYPE_WEEK_DAILY = 4, // 周报
  WS_NOTICE_TYPE_MONTH_DAILY = 5, // 月报
  WS_NOTICE_TYPE_GROUP = 6, // 群通知
  WS_NOTICE_TYPE_TASK = 7, // 任务通知
  WS_NOTICE_TYPE_PROJECT = 8, // 项目通知
  WS_NOTICE_TYPE_TIPS = 9, // 提示性消息
  WS_NOTICE_TYPE_QUESTIONNAIRE = 10 // 問卷
}

export const fileAudioVideo = [
  messageType.WS_MSG_TYPE_AUDIO,
  messageType.WS_MSG_TYPE_VIDEO,
  messageType.WS_MSG_TYPE_FILE,
  messageType.WS_MSG_TYPE_MP3,
  messageType.WS_MSG_TYPE_NOT_PREVIEWABLE_FILE
]
// message file type
export const messageFileType = [
  messageType.WS_MSG_TYPE_VIDEO,
  messageType.WS_MSG_TYPE_FILE,
  messageType.WS_MSG_TYPE_MP3,
  messageType.WS_MSG_TYPE_NOT_PREVIEWABLE_FILE
]

export const filePhotoTextRemark = [
  messageType.WS_MSG_TYPE_PIC,
  messageType.WS_MSG_TYPE_VIDEO,
  messageType.WS_MSG_TYPE_FILE,
  messageType.WS_MSG_TYPE_MP3,
  messageType.WS_MSG_TYPE_NOT_PREVIEWABLE_FILE
]

export enum EQuesStatus {
  '未开始',
  '进行中',
  '已中止',
  '已结束'
}

export enum EQuesTag {
  '实名' = 1,
  '匿名',
  '可修改'
}

export enum ECreatorType {
  '显示发起者' = 1,
  '显示部门',
  '隐藏发起者'
}

export const statisticsTypeOption = [
  {
    label: '隐藏',
    value: 0
  },
  {
    label: '显示部分范围',
    value: 1
  }
]

export const statisticsScopeOption = [
  {
    label: '概要',
    value: 1
  },
  {
    label: '详情',
    value: 2
  }
]
export const statisticsScopeOnlySummary = [
  {
    label: '概要',
    value: 1
  }
]

export const creatorTypeOption = [
  {
    label: '显示发起者帐号',
    value: 1
  },
  {
    label: '显示发起者所属部门',
    value: 2
  },
  {
    label: '隐藏发起者资讯',
    value: 3
  }
]

export enum ESubType {
  '選擇題' = 1,
  '下拉題',
  '日期題',
  '評分題',
  '簡答題'
}

export enum ECompany {
  'company',
  'network',
  'equipment'
}

export enum EMonitor {
  'chatRoom',
  'chatMember'
}

export enum EApproval {
  'verifyType',
  'verifyTemplate',
  'verifyUpdate',
  'verifyExport'
}

export enum ENotice {
  'create',
  'history'
}

export enum EChatSett {
  'chatConfig',
  'chatPerson',
  'chatExport'
}

export enum EUpdate {
  'updateApp',
  'updatePCL',
  'updatePC'
}

export const verifyStatusOption = [
  {
    label: '全部',
    value: 999
  },
  {
    label: '开启',
    value: 0
  },
  {
    label: '关闭',
    value: 1
  }
]

export const chatRoomTypeOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '私聊',
    value: '1'
  },
  {
    label: '群聊',
    value: '2'
  }
]

export enum EChatType {
  '私聊' = 1,
  '群聊' = 2
}

export enum EChatStatus {
  '未解散',
  '已解散'
}

export enum EProjectStatus {
  '未开始',
  '进行中',
  '已完成',
  '已延期',
  '延期完成'
}

export enum EProjectType {
  '重要',
  '临时'
}

export const verifyFlowStatusOption = [
  {
    label: '新增',
    value: 1
  },
  {
    label: '修改',
    value: 2
  },
  {
    label: '删除',
    value: 3
  }
]

export const verifyFlowsTypeOptions = [
  {
    label: '－基础设置－',
    options: [
      {
        value: 2,
        label: '管理员'
      },
      {
        value: 3,
        label: '数据汇出'
      }
    ]
  },
  {
    label: '－流程设置－',
    options: [
      {
        value: 4,
        label: '发起人'
      },
      {
        value: 6,
        label: '抄送人'
      }
    ]
  },
  {
    label: '',
    options: [
      {
        value: 1,
        label: '全部'
      }
    ]
  }
]

export const verifyExportTimeType = [
  {
    label: '发起时间',
    value: '0'
  },
  {
    label: '完成时间',
    value: '1'
  },
  {
    label: '审批时间',
    value: '2'
  }
]
export const verifyTemplateTimeType = [
  {
    label: '发起时间',
    value: '0'
  },
  {
    label: '更新时间',
    value: '1'
  }
]

export const verifyExportStatus = [
  {
    label: '审批中',
    value: '0',
    disabled: false
  },
  {
    label: '已完成',
    value: '1',
    disabled: false
  },
  {
    label: '已驳回',
    value: '2',
    disabled: false
  },
  {
    label: '已撤销',
    value: '3',
    disabled: false
  },
  {
    label: '待核销',
    value: '7',
    disabled: false
  }
]
export enum EVerifyTemplateIcons {
  'qingjia',
  'baoxiao',
  'feiyong',
  'chuchai',
  'caigou',
  'jiaban',
  'waichu',
  'yongzhang',
  'fukuan',
  'yongche',
  'jixiao',
  'moren'
}

export const currencyOptions = [
  'CNY-人民币',
  'USD-美元',
  'TWD-新台币',
  'KRW-韩元',
  'PHP-比索',
  'VND-越南盾',
  'EUR-欧元',
  'MYR-马币',
  'USDT',
  'TRX',
  'ETH'
]

export const currencyTableData = [
  {
    en: 'CNY',
    cn: '人民币',
    rate: '1.00'
  },
  {
    en: 'USD',
    cn: '美元',
    rate: '7.1'
  },
  {
    en: 'TWD',
    cn: '新台币',
    rate: '0.22'
  },
  {
    en: 'KRW',
    cn: '韩元',
    rate: '0.005'
  },
  {
    en: 'PHP',
    cn: '比索',
    rate: '0.12'
  },
  {
    en: 'VND',
    cn: '越南盾',
    rate: '0.0003'
  },
  {
    en: 'EUR',
    cn: '欧元',
    rate: '8.02'
  },
  {
    en: 'MYR',
    cn: '马币',
    rate: '1.58'
  },
  {
    en: 'USDT',
    cn: 'USDT',
    rate: '7'
  },
  {
    en: 'TRX',
    cn: 'TRX',
    rate: '0.55'
  },
  {
    en: 'ETH',
    cn: 'ETH',
    rate: '13851.81'
  }
]
export const payInDetailTable = [
  {
    currency: '法定货币',
    detail: '收款姓名 / 收款银行 / 收款帐号'
  },
  {
    currency: '虚拟货币',
    detail: '收款地址'
  }
]

export const feeTypeOption = [
  {
    label: '薪资申请',
    value: '1'
  },
  {
    label: '资金打款',
    value: '2'
  },
  {
    label: '厂商费用',
    value: '3'
  },
  {
    label: '固定费用',
    value: '4'
  },
  {
    label: '临时费用',
    value: '5'
  },
  {
    label: '设备采购',
    value: '6'
  },
  {
    label: '其他',
    value: '99'
  }
]

export enum ECompENToCN {
  'input' = '单行输入框',
  'staticText' = '多行输入框',
  'radio' = '单选框',
  'checkbox' = '多选框',
  'select' = '下拉框',
  'date' = '日期',
  'date_interval' = '日期区间',
  'number' = '数字',
  'amount' = '金额',
  'switch' = '开关',
  'file' = '附件',
  'part' = '明细',
  'month' = '归属月份',
  'feeType' = '费用类型'
}

export const MEETPOINT = 'meet point'
export const ENDPOINT = 'end'
export const meetObject = {
  layer: MEETPOINT,
  priority: '0',
  path: '',
  condition: '',
  value: '',
  verifyFlowList: [
    {
      autoAdmin: '', // 默认值为空字符串
      autoPass: '', // 默认值为空字符串
      gradeCount: '0', // 默认值为 "0"
      layer: '0', // 默认值为 "0"
      onePass: '', // 默认值为空字符串
      positionId: '', // 默认值为空字符串
      verifyFlow: MEETPOINT, // 默认值为 "default"，因为是必需属性
      verifyPeople: [], // 默认值为空数组
      selfOption: '', // 默认值为空字符串
      verifyNameList: [], // 默认值为空数组
      index: 0, // 默认值为 0
      id: '', // 默认值为空字符串
      x: 0, // 默认值为 0
      y: 0, // 默认值为 0
      isCondition: false, // 默认值为 false
      source: [],
      target: '' // 默认值为空字符串
    }
  ],
  copyFlow: {
    copyTarget: [],
    copyTargetPosition: [],
    copyTargetDept: []
  },
  id: '',
  xIndex: -1,
  isElse: false,
  x: 0,
  y: 0,
  isCondition: false,
  target: '',
  source: [],
  cardType: 'default'
} as TFlowITem

export const defaultTargetOption = [
  {
    label: '所属部门',
    type: 'belongDept',
    value: '999'
  },
  {
    label: '使用部门',
    type: 'useDept',
    value: '998'
  }
]

export const EQOption = [
  {
    label: '等于',
    value: 'eq'
  },
  {
    label: '不等于',
    value: 'ne'
  }
]

export const matchOption = [
  {
    label: '完全匹配',
    value: 'fmatch'
  },
  {
    label: '包含以下任一',
    value: 'incl'
  },
  {
    label: '不包含',
    value: 'nincl'
  }
]

export const numberOption = [
  {
    label: '小于',
    value: 'lt'
  },
  {
    label: '小于等于',
    value: 'lte'
  },
  {
    label: '大于',
    value: 'gt'
  },
  {
    label: '大于等于',
    value: 'gte'
  },
  {
    label: '等于',
    value: 'eq'
  }
]

export enum ECondition {
  eq = '等于',
  ne = '不等于',
  fmatch = '完全匹配',
  incl = '包含以下任一',
  nincl = '不包含',
  lt = '小于',
  lte = '小于等于',
  gt = '大于',
  gte = '大于等于'
}
