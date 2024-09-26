import { dateTimeHelper } from '@/utils/dateTimeHelper'
import { currencyTableData } from '@/const/appConst'

export const verifyComponent = [
  {
    category: '输入框',
    children: [
      {
        type: 'input',
        name: '单行输入框', // 右邊區塊的 title
        titleValue: '单行输入框', // 标题內容
        titlePlaceholder: '请输入标题，最多16个字', // 标题的 placeholder
        hintValue: '请输入', // 提示內容
        hintPlaceholder: '请输入提示，最多12个字', // 提示的 placeholder
        helpValue: '', // 輔助說明的內容
        helpPlaceholder: '请输入说明，最多50个字', // 輔助說明的 placeholder
        timerPlaceholder: [], // 日期區間選擇的 placeholder
        required: false, // 是否必填
        options: [], // 單選 多選 下拉的選項
        defaultValue: false, // 開關元件的預設
        children: [], // 明細才需要
        currencyValue: [], // 被選擇的幣值
        isActive: false, // 點亮border
        canSetMore: false // 明細 & 费用明細 才需要 添加更多 (费用明細 寫死 true)
      },
      {
        type: 'staticText',
        name: '多行输入框',
        titleValue: '多行输入框',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请输入',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      }
    ]
  },
  {
    category: '选项',
    children: [
      {
        type: 'radio',
        name: '单选',
        titleValue: '单选',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请选择',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: ['单选项1', '单选项2', '单选项3'],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'checkbox',
        name: '多选',
        titleValue: '多选',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请选择',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: ['多选框1', '多选框2', '多选框3', '多选框4', '多选框5'],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'select',
        name: '下拉选',
        titleValue: '下拉选',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '下拉请选择',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: ['选项1', '选项2', '选项3', '选项4'],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      }
    ]
  },
  {
    category: '日期',
    children: [
      {
        type: 'date',
        name: '日期',
        titleValue: '日期',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请选择日期',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'date_interval',
        name: '日期区间',
        titleValue: '日期区间',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '',
        hintPlaceholder: '',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: ['开始日期', '结束日期'],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      }
    ]
  },
  {
    category: '数值',
    children: [
      {
        type: 'number',
        name: '数字',
        titleValue: '数字',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请输入数字',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'amount',
        name: '金额',
        titleValue: '金额',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '请输入金额',
        hintPlaceholder: '请输入提示，最多12个字',
        helpValue: '申请金额限相同币种，如欲申请多币种请拆单申请！',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: currencyTableData.map(_ => {
          return {
            enName: _.en,
            cnName: _.cn,
            exchangeRate: _.rate,
            editRate: ''
          }
        }),
        isActive: false,
        canSetMore: false
      }
    ]
  },
  {
    category: '其他',
    children: [
      {
        type: 'switch',
        name: '开关',
        titleValue: '开关',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '',
        hintPlaceholder: '',
        helpValue: '',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'file',
        name: '附件',
        titleValue: '附件',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '',
        hintPlaceholder: '',
        helpValue: '支持扩展名：.doc .docx .pdf .jpg...',
        helpPlaceholder: '请输入说明，最多50个字',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      },
      {
        type: 'part',
        name: '明细',
        titleValue: '明细',
        titlePlaceholder: '请输入标题，最多16个字',
        hintValue: '',
        hintPlaceholder: '',
        helpValue: '',
        helpPlaceholder: '',
        timerPlaceholder: [],
        required: false,
        options: [],
        defaultValue: false,
        children: [],
        currencyValue: [],
        isActive: false,
        canSetMore: false
      }
    ]
  }
]

export const verifyTemplateComponent = [
  {
    type: 'defaultTemplate',
    name: '基础信息',
    titleValue: '基础信息',
    titlePlaceholder: '请输入标题，最多16个字',
    canSetMore: false,
    isActive: false,
    helpValue: '',
    options: [],
    required: false,
    timerPlaceholder: '',
    children: [
      {
        itemName: '费用类型',
        placeholder: '请选择类型',
        required: true,
        elementKey: 'feeType'
      },
      {
        itemName: '审批标题',
        placeholder: '请输入',
        required: true,
        elementKey: 'input'
      },
      {
        itemName: '归属平台',
        placeholder: 'MX / NLD / GB',
        required: true,
        elementKey: 'platform'
      },
      {
        itemName: '归属月份',
        placeholder: dateTimeHelper.formatDateDashNextMount(new Date()),
        required: true,
        elementKey: 'month'
      }
    ]
  },
  {
    type: 'amountDetail',
    name: '费用明細',
    titleValue: '费用明細',
    titlePlaceholder: '请输入标题，最多16个字',
    canSetMore: true,
    isActive: false,
    helpValue: '',
    options: [],
    required: false,
    timerPlaceholder: '',
    children: [
      {
        itemName: '名称',
        placeholder: '请输入',
        required: true,
        elementKey: 'input'
      },
      {
        itemName: '规格',
        placeholder: '请输入',
        required: false,
        elementKey: 'input'
      },
      {
        itemName: '数量',
        placeholder: '请输入，无数量需求请输入1',
        required: true,
        elementKey: 'amountCount'
      },
      {
        itemName: '单价',
        placeholder: '请输入',
        required: true,
        elementKey: 'amount'
      },
      {
        itemName: '說明',
        placeholder: '请输入',
        required: true,
        elementKey: 'staticText'
      },
      {
        itemName: '附件',
        placeholder: '支持扩展名：.doc .docx .pdf .jpg...',
        required: false,
        elementKey: 'file'
      },
      {
        itemName: '备注',
        placeholder: '请输入',
        required: false,
        elementKey: 'staticText'
      },
      {
        itemName: '收款姓名',
        placeholder: '请输入',
        required: false,
        elementKey: 'input'
      },
      {
        itemName: '收款银行',
        placeholder: '请输入',
        required: false,
        elementKey: 'input'
      },
      {
        itemName: '收款帐号',
        placeholder: '请输入',
        required: false,
        elementKey: 'input'
      },
      {
        itemName: '收款地址',
        placeholder: '请输入',
        required: false,
        elementKey: 'input'
      }
    ]
  }
]
