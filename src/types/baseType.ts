export type TResponseData<T> = {
  code: number
  data: T
  message: string
  traceId: string
}

export type TQueryData<L> = {
  firstPage: number
  hasNextPage: false
  hasPreviousPage: false
  isFirstPage: false
  isLastPage: false
  lastPage: number
  list: L
  navigateFirstPage: number
  navigateLastPage: number
  navigatePages: number
  navigatepageNums?: string
  nextPage: number
  pageNum: number
  pageSize: number
  pages: number
  prePage: number
  total: number
}

export type TFormComponent = {
  type: string
  name: string
  placeholder: string | string[]
  showLabel: boolean
  required: boolean
  label: {
    labelTitle: string
    labelPosition: string
    labelwidth: number
    labelWidth: string
  }
  options?: string[]
  value: string | boolean
  apiKey: string
  showValue: string
  style: {}
  description: string
  isActive?: boolean
  id?: number
  switchValue?: boolean
}

export type TOptionItemType = {
  label: string
  value: string | number
  disabled?: boolean
  children?: TOptionItemType[]
}

export type TPagerType = {
  pageNum: number
  pageSize: number
  total: number
}

export type TCurrentPagerType = {
  currentPage: number
  pageSize: number
  total: number
}

export type TDefaultTemplate = {
  type: string
  name: string
  titleValue: string
  titlePlaceholder: string
  canSetMore: boolean
  isActive: boolean
  children: TVerifyComponent[]
}

export type TVerifyComponent = {
  type: string
  name: string // 右邊區塊的 title
  titleValue: string // 標題內容
  titlePlaceholder: string // 標題的 placeholder
  hintValue: string // 提示內容
  hintPlaceholder: string // 提示的 placeholder
  helpValue: string // 輔助說明的內容
  helpPlaceholder: string // 輔助說明的 placeholder
  timerPlaceholder: string[] // 日期區間選擇的 placeholder
  required: boolean // 是否必填
  options: string[] // 單選 多選 下拉的選項
  defaultValue: boolean // 開關元件的預設
  children: TVerifyComponent[] // 明細才需要
  currencyValue: TCurrency[] // 被選擇的幣值
  isActive: boolean // 點亮border
  canSetMore: boolean // 添加明细设置
} & TVerifyTemplateDefaultItem

export type TVerifyTemplateDefaultItem = {
  itemName: string
  placeholder: string
  required: boolean
  elementKey: string
  itemId?: string
}

export type TOption = { label: string; value: string }

export type TCenterList = TDefaultTemplate &
  TVerifyComponent & {
    centerIndex: number
    indexInPart: number
  } & {
    children: TFrontEndUseForm[]
    feeTypeOption: TOption[] // 费用类型的選項列表
    itemId?: string
  }

export type TFusionCenter = (TFormComponent & TCenterList)[]

export type TFrontEndUseForm = {
  type: string
  name: string // titleValue 標題內容

  description: string // helpValue  輔助說明的內容
  options: string[] // 單選 多選 下拉的選項
  required: boolean // 是否必填
  placeholder: string | string[] // hintValue 提示內容  例外: 日期区间: ['开始日期', '结束日期']

  children: TFrontEndUseForm[] // 明細才需要
  currencyValue: TCurrency[] // 被選擇的幣值
  canSetMore: boolean // 添加明细设置
  switchValue: boolean
  currencySelected: TCurrency // 給前台做使用而設置的欄位
  feeTypeOption: TOption[] // 费用类型的選項列表
  currencyType: string
  itemId?: string
}
export type TFrontEndUseSummaryForm = TFrontEndUseForm & TSummary

export type TSummary = {
  partKey: string
  totalAmount: string // 總申請金額
  totalCount: string // 明細總筆數
  currencyList: TCurrency[] // 同組明細的不同幣種與匯率集合
  isHaveAmountType: boolean // 根據有無amount 元件判斷要顯示比數還是顯示汇总
  itemId: string
}

export type TCurrency = {
  enName: string
  cnName: string
  exchangeRate: string
  editRate: string
  value?: string
}
