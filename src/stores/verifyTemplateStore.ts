import { defineStore } from 'pinia'
import {
  TCenterList,
  TCurrency,
  TFormComponent,
  TFrontEndUseForm,
  TFrontEndUseSummaryForm,
  TFusionCenter,
  TOption,
  TOptionItemType,
  TVerifyComponent,
  TVerifyTemplateDefaultItem
} from '@/types/baseType'
import {
  TConditionCC,
  TFlowITem,
  TGetTemplateByIDV4,
  TGetUserTree,
  TGetVerifyTemplatePayload,
  TGetVerifyTypeTableData,
  TStep3Verify,
  TTemplatePayloadV4,
  TUserTreeVoList,
  TVerifyPeoples
} from '@/types/apiTypes'
import { TFooter, treeHelper } from '@/utils/setTreeHelper'
import {
  currencyTableData,
  ECompENToCN,
  ENDPOINT,
  feeTypeOption,
  MEETPOINT
} from '@/const/appConst'
import { verifyTemplateComponent } from '@/const/verifyWidget'
import AppUtils from '@/utils/appUtils'
import { personnelStore } from './personnelStore'
import { flowStore } from './flowStore'

const maxCcCount = 40

const VerifyTemplateStore = defineStore('verifyTempStore', {
  state: () => ({
    step: 1,
    jumpStep: 0,
    templateDialogTitle: '', // 共用彈窗名稱

    verifyTypeOptions: [] as TOptionItemType[], // step 1 審批類型選項內容
    verifyTypeList: [] as TGetVerifyTypeTableData[], // 審批類型 原型資料
    treeData: [] as TGetUserTree[], // 指定成員所需樹狀資料
    fullTreeData: [] as TGetUserTree[], // 指定成員所需樹狀資料 (不會被搜尋所改變)
    templateAdmin: [] as TVerifyPeoples[], // step 1 選擇的管理員
    templateExportList: [] as TVerifyPeoples[], // step 1 選擇的數據匯出對象
    templateAvatar: '', // step 1 圖標名稱
    templateName: '', // step 1 表單名稱
    memo: '', // step 1 表單說明
    verifyTemplateTypeId: '', // step 1 审批类型
    verifyTWriteOff: false, // step 1 核销流程是否開啟

    centerList: [] as TCenterList[], // step 2 列表
    settingItem: {} as TCenterList, // step2 設定中的元件資料

    ccPersonList: [] as TFooter[], // 抄送人
    ccDeptList: [] as TFooter[], // 抄送人的部門
    ccPostList: [] as TFooter[], // 抄送人的崗位

    scopeList: [] as TFooter[], // 發起人（部門, 成員）
    scopeDeptList: [] as TFooter[], // 發起人的部門
    scopeMemberList: [] as TFooter[], // 發起人的成員
    scopePostList: [] as TFooter[], // 發起人的崗位

    position_option: [] as TOption[], // 抽屜的部門選項

    flowList: [
      // verify card list 審批人
      {
        verifyFlow: '',
        verifyPeople: [],
        verifyNameList: []
      }
    ] as TStep3Verify[],

    settingFlow: {} as TStep3Verify, // 設定中的審批item
    pureFlowItem: {} as TStep3Verify,
    settingIndex: 0, // 設定中的審批index

    writeOffFlowList: [
      // verify card list 核銷的審批人
      {
        verifyFlow: '',
        verifyPeople: [],
        verifyNameList: []
      }
    ] as TStep3Verify[],
    offsettingFlow: {} as TStep3Verify, // 設定中的審批item '核銷'
    pureOffFlowItem: {} as TStep3Verify,
    isWriteOffDraw: false, // 點開的是否為核銷的審批人 or 抄送人

    editingTemplateId: '',
    allVOList: [] as TUserTreeVoList[],
    setLimitMax: false, // step3 指定成員 限制人數最多10人

    templateFilterData: {} as TGetVerifyTemplatePayload,
    templateIsEdit: false,
    rateMapFromJson: [] as { enName: string; rate: string }[],
    ccLimitIsMax: false,

    nextClickedVisible: false,
    scopeCCDrawVisible: false,
    scopeCCDrawName: '',
    pureScopeList: [] as TFooter[],
    pureCcList: [] as TFooter[],
    activeCardName: '',
    settingCcId: '',
    isOutSideCC: false,

    conditionCcPersonList: [] as TFooter[], // 抄送人
    conditionCcDeptList: [] as TFooter[], // 抄送人的部門
    conditionCcPostList: [] as TFooter[], // 抄送人的崗位

    submitPayload: {} as TTemplatePayloadV4
  }),
  getters: {
    isWriteOffDraw: state => {
      return state.step === 4
    },
    scopeNameList: state => {
      const deptNameList = state.scopeDeptList.map(_ => _.label)
      const memberNameList = state.scopeMemberList.map(_ => _.label)
      const postNameList = state.scopePostList.map(_ => _.label)
      return [...deptNameList, ...memberNameList, ...postNameList]
    },

    ccPersonNameList: state => {
      const deptNameList = state.ccDeptList.map(_ => _.label)
      const memberNameList = state.ccPersonList.map(_ => _.label)
      const postNameList = state.ccPostList.map(_ => _.label)
      return [...deptNameList, ...memberNameList, ...postNameList]
    },
    ccPersonInConditionNameList: state => {
      const deptNameList = state.conditionCcDeptList.map(_ => _.label)
      const memberNameList = state.conditionCcPersonList.map(_ => _.label)
      const postNameList = state.conditionCcPostList.map(_ => _.label)
      return [...deptNameList, ...memberNameList, ...postNameList]
    },

    flowNameList: state => {
      const flowData = state.isWriteOffDraw
        ? state.offsettingFlow
        : state.settingFlow
      return flowData.verifyPeople.map(_ => _.userName)
    },
    peopleList: state => {
      return state.settingFlow.verifyPeople
        ? state.settingFlow.verifyPeople
        : []
    },
    writeOffPeopleList: state => {
      return state.offsettingFlow.verifyPeople
        ? state.offsettingFlow.verifyPeople
        : []
    },
    offPeopleList: state => {
      return state.offsettingFlow.verifyPeople
        ? state.offsettingFlow.verifyPeople
        : []
    }
  },
  actions: {
    async getVerifyType() {
      // const result = await BaseApi.getVerifyTypeTableData()
      // if (result.code === 200) {
      //   this.verifyTypeList = result.data
      //   this.verifyTypeOptions = result.data.map(_ => {
      //     return {
      //       label: _.templateTypeName,
      //       value: _.id
      //     }
      //   })
      // }
    },
    async getTreeData() {
      // const result = await BaseApi.getUserTree()
      // if (result.code == 200) {
      //   this.treeData = result.data
      //   this.fullTreeData = result.data
      // }
    },
    async filterTreeData(keyword: string) {
      if (this.treeData.length == 0) {
        await this.getTreeData()
      }
      let defaultTree = AppUtils.deepCloneData(this.treeData)
      this.treeData = treeHelper.approvalFilterTree(defaultTree, keyword)
    },

    async getPositOptions() {
      // const result = await BaseApi.getPositionOption()
      // if (result.code == 200) {
      //   this.position_option = result.data.map(_ => {
      //     return {
      //       value: _.id,
      //       label: _.positionName
      //     }
      //   })
      // }
    },

    setDialogTitle(title: string, setLimit: boolean = false) {
      // step 1 & 3 設置共用彈窗標題
      this.templateDialogTitle = title
      this.setLimitMax = setLimit
    },

    // step 1
    setAdminList(admin: TVerifyPeoples[]) {
      // step 1 設置管理員
      this.templateAdmin = admin
    },
    setExportList(exportList: TVerifyPeoples[]) {
      // step 1 設置數據匯出
      this.templateExportList = exportList
    },
    setVerifyIcon(iconName: string) {
      // step 1 表單圖標
      this.templateAvatar = iconName
    },
    setVerifyTemplateName(name: string) {
      // step 1 表單名稱
      this.templateName = name
    },
    setVerifyMemo(memo: string) {
      // step 1 表單說明
      this.memo = memo
    },
    setVerifyTemplateId(templateId: string) {
      // step 1 审批类型
      this.verifyTemplateTypeId = templateId
    },

    setVerifyTWriteOff(status: boolean) {
      // step 1 核销流程
      this.verifyTWriteOff = status
    },
    goStepFromSpecify(step: number) {
      // 前往指定step
      this.step = step
    },

    // step 2
    updateCenterListInStore(list: TCenterList[]) {
      // 設置step 2 中間列表
      this.centerList = [...list]
    },
    setActiveBorder(index: number) {
      // console.log('this.centerList', this.centerList)
      // 設置step 2 中間列表的 active border
      this.centerList.forEach((_, idx) => {
        this.centerList[idx].isActive = idx == index
        this.centerList[idx].children.forEach(child => {
          child.isActive = false
        })
      })
    },
    setStoreActiveBorderInPart(centerIndex: number, indexInPart: number) {
      // 設置step 2 中間列表 明細內 (part) 的 active border
      const cloneListItem = AppUtils.deepCloneData(
        this.centerList[centerIndex]
      ) as TCenterList
      cloneListItem.children.forEach((child, idx) => {
        cloneListItem.children[idx].isActive = idx == indexInPart
      })
      setTimeout(() => {
        this.centerList.splice(centerIndex, 1, cloneListItem)
        this.centerList.forEach((item, index) => {
          this.centerList[index].isActive = index == centerIndex
        })
      }, 100)
    },
    copyCenterItem(
      data: TCenterList,
      index: number,
      indexInPart: number = 99999
    ) {
      // 複製列表的Item
      if (indexInPart == 99999) {
        this.centerList.splice(index + 1, 0, data)
      } else {
        this.centerList[index].children.splice(indexInPart + 1, 0, data)
      }
    },
    delCenterItem(
      index: number,
      indexInPart: number = 99999,
      itemId: string = ''
    ) {
      if (flowStore.updateConditionFromStep2(itemId)) {
        ElMessage.warning('请先移除条件设定')
        return
      }

      // 刪除列表內指定元件 indexInPart 是明細 (part) 內的index
      if (indexInPart == 99999) {
        this.centerList.splice(index, 1)
      } else {
        this.centerList[index].children.splice(indexInPart, 1)
      }
      this.setSettingData({} as TCenterList)
    },

    setSettingData(data: TCenterList) {
      // 暫存指定元件資料 給右側設定區塊使用
      this.settingItem = data
    },

    setSetDataInList(
      centerIndex: number,
      indexInPart: number,
      afterSetData: TCenterList
    ) {
      // 右側設定變動時 更新暫存列表資料
      if (indexInPart == undefined) {
        this.centerList.splice(centerIndex, 1, afterSetData)
      } else {
        const cloneListItem = AppUtils.deepCloneData(
          this.centerList[centerIndex]
        ) as TCenterList
        cloneListItem.children.splice(indexInPart, 1, afterSetData)
        this.centerList.splice(centerIndex, 1, cloneListItem)
      }
    },
    // step 3
    setInputReadonly() {
      // 設定抽屜的 input 匡唯讀
      const select__input = document.querySelectorAll('.el-select__input')
      select__input.forEach(_ => {
        _.setAttribute('readonly', 'true')
      })
    },

    setActiveCard(cardName: string) {
      this.activeCardName = cardName
    },
    nowSettingCCId(cardId: string) {
      this.settingCcId = cardId
    },

    // -------  發起人 -------
    //step 3  發起人 depart
    setStoreScopeDept(deptList: TFooter[]) {
      this.scopeDeptList = deptList
    },
    //step 3  發起人 member
    setStoreScopeMember(memberList: TFooter[]) {
      this.scopeMemberList = memberList
    },
    //step 3  發起人 post
    setStoreScopePost(postList: TFooter[]) {
      this.scopePostList = postList
    },
    // step 3 - option dialog - footer tag list
    getFooterTagList() {
      return [
        ...this.scopeDeptList,
        ...this.scopeMemberList,
        ...this.scopePostList
      ]
    },

    // step 3 scope dialog submit
    setScopeListToStore(arr: TFooter[]) {
      const deptList = arr.filter(item => item.tabName == 'dept')
      const memberList = arr.filter(item => item.tabName == 'member')
      const postList = arr.filter(item => item.tabName == 'post')
      this.setStoreScopeDept([...deptList])
      this.setStoreScopeMember([...memberList])
      this.setStoreScopePost([...postList])
    },

    // step 3 scope 打開側邊前 保存初始資料
    setPureScopeListToStore(arr: TFooter[]) {
      this.pureScopeList = arr
    },
    // step 3 從 el-select 按下 x 清除指定tag
    removeScopeTagFromInput(tagName: string) {
      const scopeList = this.getFooterTagList()
      const afterRemoveList = scopeList.filter(_ => _.label != tagName)
      this.setScopeListToStore(afterRemoveList)
    },
    // step 3 從 el-select 按下 x 全部清除 (步驟表與抽屜)
    clearScopeSelected() {
      this.setStoreScopeDept([])
      this.setStoreScopeMember([])
      this.setStoreScopePost([])
    },

    // ---------- 抄送人 ---------

    //step 3  抄送人 depart
    setStoreCCDept(deptList: TFooter[]) {
      this.ccDeptList = deptList
    },
    //step 3  抄送人 member
    setStoreCCMember(memberList: TFooter[]) {
      this.ccPersonList = memberList
    },
    //step 3  抄送人 post
    setStoreCCPost(postList: TFooter[]) {
      this.ccPostList = postList
    },
    // step 3 cc 打開側邊前 保存初始資料
    setPureCCListToStore(arr: TFooter[]) {
      this.pureCcList = arr
    },

    // step 3 條件內的操送人 彈窗資料
    setInsideCCToStore(data: TConditionCC) {
      const deptList = AppUtils.deepCloneData(data.copyTargetDept) as {
        id: string
        name: string
      }[]
      const memberList = AppUtils.deepCloneData(
        data.copyTarget
      ) as TVerifyPeoples[]
      const postList = AppUtils.deepCloneData(data.copyTargetPosition) as {
        id: string
        name: string
      }[]

      const footerDept = deptList.map(item => {
        return {
          id: item.id,
          label: item.name,
          tabName: 'dept'
        }
      })
      const footerMember = memberList.map(item => {
        return {
          id: item.userId!,
          label: item.userName!,
          tabName: 'member'
        }
      })
      const footerPost = postList.map(item => {
        return {
          id: item.id,
          label: item.name,
          tabName: 'post'
        }
      })
      this.setDeptCCIntoStore(footerDept)
      this.setMemberCCIntoStore(footerMember)
      this.setPostCCIntoStore(footerPost)
    },
    setDeptCCIntoStore(arr: TFooter[]) {
      this.conditionCcDeptList = arr
    },
    setMemberCCIntoStore(arr: TFooter[]) {
      this.conditionCcPersonList = arr
    },
    setPostCCIntoStore(arr: TFooter[]) {
      this.conditionCcPostList = arr
    },
    setCCLimitIsMax(visible: boolean) {
      this.ccLimitIsMax = visible
    },

    // step 3 - cc dialog - footer tag list
    getCCFooterTagList() {
      let totalTag = [
        ...this.ccDeptList,
        ...this.ccPersonList,
        ...this.ccPostList
      ].length
      if (totalTag >= maxCcCount) {
        this.setCCLimitIsMax(true)
        return [
          ...this.ccDeptList,
          ...this.ccPersonList,
          ...this.ccPostList
        ].slice(0, maxCcCount)
      }
      this.setCCLimitIsMax(false)
      return [...this.ccDeptList, ...this.ccPersonList, ...this.ccPostList]
    },
    getConditionCCFooterTagList() {
      let totalTag = [
        ...this.conditionCcDeptList,
        ...this.conditionCcPostList,
        ...this.conditionCcPersonList
      ].length

      if (!this.ccLimitIsMax) {
        const outSideCcList = [
          ...this.ccDeptList,
          ...this.ccPersonList,
          ...this.ccPostList
        ]
        if (totalTag >= maxCcCount - outSideCcList.length) {
          this.setCCLimitIsMax(true)
          return [
            ...this.conditionCcDeptList,
            ...this.conditionCcPostList,
            ...this.conditionCcPersonList
          ].slice(0, maxCcCount - outSideCcList.length)
        } else {
          this.setCCLimitIsMax(false)
          return [
            ...this.conditionCcDeptList,
            ...this.conditionCcPostList,
            ...this.conditionCcPersonList
          ]
        }
      } else {
        return [
          ...this.conditionCcDeptList,
          ...this.conditionCcPostList,
          ...this.conditionCcPersonList
        ]
      }
    },

    // step 3 cc dialog submit
    setCCListToStore(arr: TFooter[], isOutSide: boolean) {
      const deptList = arr.filter(item => item.tabName == 'dept')
      const memberList = arr.filter(item => item.tabName == 'member')
      const postList = arr.filter(item => item.tabName == 'post')

      if (isOutSide) {
        this.setStoreCCDept([...deptList])
        this.setStoreCCMember([...memberList])
        this.setStoreCCPost([...postList])
      } else {
        this.setDeptCCIntoStore([...deptList])
        this.setMemberCCIntoStore([...memberList])
        this.setPostCCIntoStore([...postList])
      }
    },

    // step 3 抄送人 從 el-select 按下刪除指定 tag
    removeCcTagFromInput(tagName: string, isOutSide: boolean) {
      let ccList
      if (isOutSide) {
        ccList = this.getCCFooterTagList()
      } else {
        ccList = this.getConditionCCFooterTagList()
      }

      const afterRemoveList = ccList.filter(_ => _.label != tagName)
      this.setCCListToStore(afterRemoveList, isOutSide)
    },

    // step 3 從 el-select 按下 x 全部清除 (步驟表與抽屜)
    clearCCSelected() {
      this.setStoreCCDept([])
      this.setStoreCCMember([])
      this.setStoreCCPost([])
    },
    clearConditionCCSelected() {
      this.setDeptCCIntoStore([])
      this.setMemberCCIntoStore([])
      this.setPostCCIntoStore([])
    },

    setCCisOutSideVisible(visible: boolean) {
      this.isOutSideCC = visible
    },
    updateMaxStatus() {
      const maxStatus =
        [...this.ccDeptList, ...this.ccPersonList, ...this.ccPostList].length >=
        maxCcCount
      this.setCCLimitIsMax(maxStatus)

      return maxStatus
    },

    // ----- verify flow ------

    //  step 3 從列表點選card 暫存資料
    setNowSettingFlowItem(data: TStep3Verify, isWriteOff: boolean = false) {
      if (isWriteOff) {
        this.offsettingFlow = data
      } else {
        this.settingFlow = data
      }
    },

    // step 3 從審批人抽屜點選 radio
    setStoreFlowRadio(value: string, isWriteOff: boolean = false) {
      if (isWriteOff) {
        this.offsettingFlow.verifyFlow = value
      } else {
        this.settingFlow.verifyFlow = value
      }
    },

    //  step 3 變更暫存資料的選擇會員 彈窗送出 & 刪除tag & 清空選項
    setStoreFlowMemberSelect(
      data: TVerifyPeoples[],
      isWriteOff: boolean = false
    ) {
      if (isWriteOff) {
        this.offsettingFlow.verifyPeople = data
        this.offsettingFlow.verifyNameList = data.map(
          _ => _.userName
        ) as string[]
      } else {
        this.settingFlow.verifyPeople = data
        this.settingFlow.verifyNameList = data.map(_ => _.userName) as string[]
      }
    },
    // step 3 清除指定tag 過濾資料
    removeStoreFlowMemberTag(tagName: string, isWriteOff: boolean = false) {
      const peopleList = isWriteOff
        ? this.offsettingFlow.verifyPeople
        : this.settingFlow.verifyPeople
      const afterRemoveList =
        tagName == '' ? [] : peopleList.filter(_ => _.userName != tagName)
      this.setStoreFlowMemberSelect(afterRemoveList, isWriteOff)
    },
    // step 3 送出抽屜時塞入資料
    setStoreFlowData(
      data: string | boolean,
      keyword: string,
      isWriteOff: boolean = false
    ) {
      if (isWriteOff) {
        //@ts-ignore
        this.offsettingFlow[keyword] = data
      } else {
        //@ts-ignore
        this.settingFlow[keyword] = data
      }
    },

    // step 跳躍
    jumpStepCheckForm(jumpTo: number) {
      this.jumpStep = jumpTo
    },

    // 編輯的資料 (舊)
    async setEditDataIntoStore(editData: TGetTemplateByIDV4) {
      this.editingTemplateId = editData.id

      if (this.fullTreeData.length == 0) {
        await this.getTreeData()
      }
      this.allVOList = treeHelper.approvalFilterTreeGetVOList(this.fullTreeData)
      //step 1
      await this.setOldFormToNew(editData)

      // step 2
      const compList = JSON.parse(editData.verifyTemplateElements)
      this.setOldCompToNew(compList)

      // step 3
      await this.setFlowToNew(editData)
      await flowStore.setNewTypeFlow(editData)
    },

    async setOldFormToNew(editData: TGetTemplateByIDV4) {
      //step 1
      this.setVerifyIcon(editData.templateAvatar)
      this.setVerifyTemplateName(editData.templateName)
      this.setVerifyMemo(editData.memo)
      this.setVerifyTemplateId(editData.verifyTemplateTypeId)
      this.setVerifyTWriteOff(editData.isWriteOff == 1)

      if (editData.exportUserIdList!.length > 0) {
        const exportMemberList = treeHelper.verifyFilterTreeGetMember(
          this.allVOList,
          editData.exportUserIdList!
        )
        this.setExportList(exportMemberList)
      }
      if (editData.verifyAdmin != '') {
        this.setAdminList(JSON.parse(editData.verifyAdmin))
      }
    },

    // step 2
    setOldCompToNew(oldComp: TFusionCenter) {
      // console.log('oldComp', oldComp)
      const needSetOptionType = ['radio', 'checkbox', 'select']
      const inElseCompType = ['defaultTemplate', 'amountDetail', 'part']
      const noSummaryArr = oldComp.filter(
        _ => _.type != 'summary'
      ) as TFusionCenter
      const newCompList = noSummaryArr.map(comp => {
        let itemType: string
        if (comp.type == 'part') {
          switch (comp.name) {
            case '费用明細':
              itemType = 'amountDetail'
              break
            case '基础信息':
              itemType = 'defaultTemplate'
              break
            default:
              itemType = 'part'
          }
        } else {
          itemType = comp.type
        }
        return {
          type: itemType ? itemType : '',
          name: comp.label ? comp.label.labelTitle : comp.name, // 右邊區塊的 title
          titleValue: comp.titleValue ? comp.titleValue : comp.name, // 标题內容
          titlePlaceholder: '请输入标题，最多16个字', // 标题的 placeholder
          hintValue: comp.hintValue
            ? comp.hintValue
            : comp.type != 'date_interval'
            ? comp.placeholder
            : '', // 提示內容
          hintPlaceholder: '请输入提示，最多12个字', // 提示的 placeholder
          helpValue: comp.helpValue ? comp.helpValue : comp.description, // 輔助說明的內容
          helpPlaceholder: '请输入说明，最多50个字', // 輔助說明的 placeholder
          timerPlaceholder: comp.timerPlaceholder
            ? comp.timerPlaceholder
            : comp.type == 'date_interval'
            ? comp.placeholder
            : '', // 日期區間選擇的 placeholder
          required: comp.required, // 是否必填
          options: needSetOptionType.includes(comp.type) ? comp.options : [], // 單選 多選 下拉的選項
          defaultValue: comp.defaultValue
            ? comp.defaultValue
            : comp.type == 'switch'
            ? comp.switchValue
            : false, // 開關元件的預設
          children: inElseCompType.includes(comp.type)
            ? this.setV2CompType(comp)
            : [], // 明細 & 範本 才需要
          currencyValue:
            comp.type == 'amount' ? this.setTemplateCurrencyLValue() : [],
          isActive: false, // 點亮border
          canSetMore: comp.canSetMore ? comp.canSetMore : false, // 明細才需要 添加更多
          itemId: comp.itemId
        }
      })
      // console.log('newCompList', newCompList)
      // @ts-ignore
      this.updateCenterListInStore(newCompList)
    },

    setV2CompType(
      partComp: TFormComponent & TCenterList,
      compChild: TVerifyComponent[] = []
    ) {
      // console.log('partComp', partComp)
      const defaultTempName = ['费用明細', '基础信息']
      const childList = partComp.children as TFrontEndUseForm[]
      if (!defaultTempName.includes(partComp.name)) {
        //@ts-ignore
        compChild = childList.map(item => {
          return {
            type: item.type,
            //@ts-ignore
            name: ECompENToCN[item.type],
            titleValue: item.name,
            titlePlaceholder: '请输入标题，最多16个字',
            hintValue: item.type != 'date_interval' ? item.placeholder : '',
            hintPlaceholder: ![
              'date_interval',
              'switch',
              'file',
              'part'
            ].includes(item.type)
              ? '请输入提示，最多12个字'
              : '',
            helpValue: item.description,
            helpPlaceholder:
              item.type == 'part' ? '' : '请输入说明，最多50个字',
            timerPlaceholder:
              item.type == 'date_interval' ? item.placeholder : [],
            required: item.required, // 是否必填
            options: item.options ? item.options : [],
            defaultValue: item.type == 'switch' ? item.switchValue : false,
            children: [],
            currencyValue:
              item.type == 'amount' ? this.setTemplateCurrencyLValue() : [],
            isActive: false,
            canSetMore: false,
            feeTypeOption: [],
            itemId: item.itemId
          }
        })
      } else {
        // @ts-ignore
        compChild = childList.map(item => {
          return {
            itemName: item.name,
            placeholder: item.placeholder,
            required: item.required,
            elementKey: item.type
          }
        }) as TVerifyTemplateDefaultItem[]
      }
      return compChild
    },

    async setRateFromCloud() {
      const self = this
      await fetch('https://uat.smartxoffice.cc/exchange_rate')
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          const numValueArr = Object.keys(myJson).map((name, ind) => {
            return {
              enName: name,
              rate: Object.values(myJson)[ind]
            }
          }) as { enName: string; rate: number }[]
          self.rateMapFromJson = numValueArr.map(item => {
            return {
              enName: item.enName,
              rate: JSON.stringify(self.truncateToFiveDecimalPlaces(item.rate))
            }
          })
        })
    },
    truncateToFiveDecimalPlaces(num: number) {
      const stringValue = num.toString()
      const dotIndex = stringValue.indexOf('.')

      if (dotIndex !== -1) {
        // 小数点后超过五位则截取到五位
        return parseFloat(stringValue.slice(0, dotIndex + 6))
      } else {
        // 如果是整数，则直接返回
        return num
      }
    },

    // step 3
    async setFlowToNew(editData: TGetTemplateByIDV4) {
      if (editData.deptList != '[]' && editData.deptList != '') {
        // 發起人 部門
        let idList = JSON.parse(editData.deptList) as string[]
        await personnelStore.getTreeV2Data()

        const deptList = personnelStore.testFullList
          .filter(_ => idList.includes(_.value))
          .map(dep => {
            return {
              id: dep.value,
              label: dep.label,
              tabName: 'dept'
            }
          }) as TFooter[]

        this.setStoreScopeDept(deptList)
      }
      if (editData.userIdList != '[]' && editData.userIdList != '') {
        // 發起人 成員
        let idList = JSON.parse(editData.userIdList)
        const scopeMemberList = treeHelper.verifyFilterTreeGetMember(
          this.allVOList,
          idList
        )
        const footerMember = scopeMemberList.map(_ => {
          return {
            id: _.userId,
            label: _.userName,
            tabName: 'member'
          }
        }) as TFooter[]
        this.setStoreScopeMember(footerMember)
      }

      if (editData.positionList != '[]' && editData.positionList != '') {
        // 發起人 崗位
        if (this.position_option.length == 0) {
          await this.getPositOptions()
        }
        let idList = JSON.parse(editData.positionList) as string[]
        const scopePostList = this.position_option.filter(post =>
          idList.includes(post.value)
        )
        const footerMember = scopePostList.map(_ => {
          return {
            id: _.value,
            label: _.label,
            tabName: 'post'
          }
        }) as TFooter[]
        this.setStoreScopePost(footerMember)
      }

      if (editData.copyTarget != '[]' && editData.copyTarget != '') {
        // 抄送 人員
        const ccMember = JSON.parse(editData.copyTarget).map(
          (user: { userId: string; userName: string }) => {
            return {
              id: user.userId,
              label: user.userName,
              tabName: 'member'
            }
          }
        )
        this.setStoreCCMember(ccMember)
      }
      if (editData.copyTargetDept != '[]' && editData.copyTargetDept !== '') {
        // 抄送 部門
        this.setStoreCCDept(JSON.parse(editData.copyTargetDept))
      }

      if (
        editData.copyTargetPosition != '[]' &&
        editData.copyTargetPosition !== ''
      ) {
        // 抄送 崗位
        this.setStoreCCPost(JSON.parse(editData.copyTargetPosition))
      }

      if (editData.isWriteOff == 1) {
        const setNoRepeatList = (arr: TFooter[]) => {
          const setObj = new Set()
          return arr.filter(itm =>
            !setObj.has(itm.id) ? setObj.add(itm.id) : false
          )
        }
        if (
          editData.writeOffCopyTargetDept != '[]' &&
          editData.writeOffCopyTargetDept !== ''
        ) {
          //核銷操送部門
          const objDept = JSON.parse(
            editData.writeOffCopyTargetDept
          ) as TFooter[]
          const cloneVerifyDept = AppUtils.deepCloneData(
            this.ccDeptList
          ) as TFooter[]

          const noRePeatList = setNoRepeatList([...objDept, ...cloneVerifyDept])
          this.setStoreCCDept(noRePeatList)
        }
        if (
          editData.writeOffCopyTarget != '[]' &&
          editData.writeOffCopyTarget !== ''
        ) {
          //核銷操送人
          const objCCUser = JSON.parse(
            editData.writeOffCopyTarget
          ) as TVerifyPeoples[]
          const footerTypeList = objCCUser.map(user => {
            return {
              id: user.userId!,
              label: user.userName!,
              tabName: 'member'
            }
          })
          const cloneVerifyCCUser = AppUtils.deepCloneData(
            this.ccPersonList
          ) as TFooter[]

          const noRePeatList = setNoRepeatList([
            ...footerTypeList,
            ...cloneVerifyCCUser
          ])
          this.setStoreCCMember(noRePeatList)
        }
        if (
          editData.writeOffCopyTargetPosition != '[]' &&
          editData.writeOffCopyTargetPosition !== ''
        ) {
          //核銷操送崗位
          const objCCPosiList = JSON.parse(
            editData.writeOffCopyTargetPosition
          ) as TFooter[]

          const cloneVerifyPosi = AppUtils.deepCloneData(
            this.ccPostList
          ) as TFooter[]

          const noRePeatList = setNoRepeatList([
            ...objCCPosiList,
            ...cloneVerifyPosi
          ])
          this.setStoreCCPost(noRePeatList)
        }
      }
    },

    setSubmitPayload() {
      const deptListArr = this.scopeDeptList.map(_ => _.id)
      const postList = this.scopePostList.map(_ => _.id)
      const exportUserIdList = this.templateExportList.map(_ => _.userId)
      const userIdListArr = this.scopeMemberList.map(_ => _.id)

      const setCopyTargetType = (
        arr: TFooter[],
        data: TVerifyPeoples[] = []
      ) => {
        if (arr.length > 0) {
          data = arr.map(item => {
            return {
              userId: item.id,
              userName: item.label
            }
          })
        }

        return data
      }

      const cloneList = AppUtils.deepCloneData(this.centerList) as TCenterList[]
      const payloadCompList = this.setPayloadCompList(cloneList)
      this.submitPayload = {
        verifyLevelConditionFlowList: JSON.stringify(
          flowStore.setPayloadFlowList(flowStore.storeFlowList)
        ),

        copyTarget: JSON.stringify(setCopyTargetType(this.ccPersonList)),
        copyTargetDept: JSON.stringify(AppUtils.deepCloneData(this.ccDeptList)), // 抄送人部门
        copyTargetPosition: JSON.stringify(
          AppUtils.deepCloneData(this.ccPostList)
        ), // 抄送人岗位
        deptList: JSON.stringify(deptListArr),
        exportUserIdList: exportUserIdList,
        id: this.editingTemplateId,
        isWriteOff: this.verifyTWriteOff ? 1 : 0,
        memo: this.memo,
        positionList: JSON.stringify(postList), // 发起人岗位
        templateAvatar: this.templateAvatar,
        templateName: this.templateName,
        userIdList: JSON.stringify(userIdListArr),
        verifyAdmin: JSON.stringify(AppUtils.deepCloneData(this.templateAdmin)),

        verifyTemplateElements: JSON.stringify(payloadCompList),
        verifyTemplateTypeId: this.verifyTemplateTypeId,

        writeOffVerifyLevelConditionFlowList: this.verifyTWriteOff
          ? JSON.stringify(
              flowStore.setPayloadFlowList(flowStore.storeWriteOffFlowList)
            )
          : '[]'
      } as TTemplatePayloadV4
    },

    setPayloadCompList(
      centList: TCenterList[],
      payloadArr: TFrontEndUseSummaryForm[] = []
    ) {
      const partStrArr = ['defaultTemplate', 'amountDetail', 'part']
      centList.forEach((item, idx) => {
        payloadArr[idx] = {
          //note 第一層的每個元件
          type: partStrArr.includes(item.type) ? 'part' : item.type,
          name: item.titleValue,
          description: item.helpValue,
          options: item.options,
          required: item.required,
          placeholder:
            item.type == 'date_interval'
              ? item.timerPlaceholder
              : item.type == 'file'
              ? ''
              : item.hintValue,
          currencyValue:
            item.type == 'amount' ? this.setTemplateCurrencyLValue() : [],
          canSetMore: item.canSetMore,
          children: partStrArr.includes(item.type)
            ? this.setPartChildren(item)
            : [],
          switchValue: item.type == 'switch' ? item.defaultValue : false,
          // 以下 only for 前台
          currencySelected: {} as TCurrency, // 金額元件的被選擇幣種
          // 以下 summary
          partKey: item.canSetMore ? this.setPartKey() : '',
          totalAmount: '0', // 總申請金額
          totalCount: '0', // 明細總筆數
          currencyList: [], // 同組明細的不同幣種與匯率集合
          isHaveAmountType: false,
          feeTypeOption: [],
          currencyType: '', // 給前台判斷輸入匡類型
          itemId: item.itemId! // 條件判斷辨別 id
        }
      })
      return this.setSummaryIntoList(payloadArr)
    },
    setPartKey() {
      const characters =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomString = ''

      while (randomString.length < 8) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        const randomChar = characters.charAt(randomIndex)

        if (randomString.indexOf(randomChar) === -1) {
          randomString += randomChar
        }
      }
      return randomString
    },
    setSummaryIntoList(
      // summary 的虛擬element 從這裡給
      payloadList: TFrontEndUseSummaryForm[],
      haveSummaryArr: TFrontEndUseSummaryForm[] = []
    ) {
      const emptySummary = {
        type: 'summary',
        name: '',
        partKey: '',
        totalAmount: '0', // 總申請金額
        totalCount: '1', // 明細總筆數
        currencyList: [] as TCurrency[], // 幣種與匯率
        isHaveAmountType: false,

        //note 以下為 summary 不需要的但需要對齊的欄位
        description: '',
        options: [],
        required: false,
        placeholder: '',
        children: [],
        currencyValue: [],
        canSetMore: false,
        switchValue: false,
        currencySelected: {} as TCurrency,
        feeTypeOption: [],
        currencyType: '',
        itemId: ''
      } as TFrontEndUseSummaryForm
      // 有開啟添加更多才會有 summary
      const partIndex = payloadList.findIndex((item, index) => {
        if (
          item.type == 'part' &&
          payloadList[index + 1] &&
          payloadList[index + 1].type != 'summary' &&
          payloadList[index + 1].canSetMore
        ) {
          return (
            item.type == 'part' &&
            payloadList[index + 1] &&
            payloadList[index + 1].type != 'summary' &&
            payloadList[index + 1].canSetMore
          )
        } else {
          return item.type == 'part'
        }
      })
      if (partIndex != -1) {
        for (let i = payloadList.length - 1; i >= 0; i--) {
          if (payloadList[i].type == 'part' && payloadList[i].canSetMore) {
            payloadList.splice(i + 1, 0, emptySummary) // 在索引 i+1 处插入元素
          }
        }
      }
      haveSummaryArr = AppUtils.deepCloneData(payloadList)
      haveSummaryArr.forEach((item, idx) => {
        if (item.type == 'summary') {
          item.partKey = payloadList[idx - 1].partKey
          item.itemId = payloadList[idx - 1].itemId
          item.name = payloadList[idx - 1].name
          item.isHaveAmountType =
            payloadList[idx - 1].children.findIndex(_ => _.type == 'amount') !=
            -1
        }
      })

      return haveSummaryArr
    },

    setPartChildren(
      partComp: TCenterList,
      payloadPart = [] as TFrontEndUseForm[]
    ) {
      if (['defaultTemplate', 'amountDetail'].includes(partComp.type)) {
        payloadPart = this.setTemplatePartChildToPayload(
          partComp.type,
          partComp.itemId!
        )
      } else {
        payloadPart = partComp.children.map(item => {
          return {
            type: item.type,
            name: item.titleValue,
            description: item.helpValue,
            options: item.options,
            required: item.required,
            placeholder:
              item.type == 'date_interval'
                ? item.timerPlaceholder
                : item.type == 'file'
                ? ''
                : item.hintValue,
            currencyValue:
              item.type == 'amount' ? this.setTemplateCurrencyLValue() : [],
            canSetMore: item.canSetMore,
            children: [],
            switchValue: item.type == 'switch' ? item.defaultValue : false,
            currencySelected: {} as TCurrency,
            partKey: '',
            feeTypeOption: [],
            currencyType: '',
            itemId: partComp.itemId! // 條件判斷辨別 id
          }
        }) as TFrontEndUseForm[]
      }
      return payloadPart
    },
    setTemplatePartChildToPayload(
      templateType: string,
      item_id: string,
      data: TFrontEndUseForm[] = []
    ) {
      if (templateType) {
        const templateIndex = verifyTemplateComponent.findIndex(
          _ => _.type == templateType
        )
        if (templateIndex !== -1) {
          data = verifyTemplateComponent[templateIndex].children.map(item => {
            return {
              type: item.elementKey,
              name: item.itemName,
              description: this.setAmountDetailDescription(
                item.elementKey,
                item
              ),
              options: [],
              required: item.required,
              placeholder: item.elementKey == 'file' ? '' : item.placeholder,
              currencyValue:
                item.elementKey == 'amount'
                  ? this.setTemplateCurrencyLValue()
                  : [],
              canSetMore: false,
              children: [],
              switchValue: false,
              currencySelected: {} as TCurrency,
              partKey: '',
              feeTypeOption: item.elementKey == 'feeType' ? feeTypeOption : [],
              currencyType: this.setInputCurrencyType(item.itemName),
              itemId: item_id
            }
          }) as TFrontEndUseForm[]
        }
      }
      return data
    },
    setAmountDetailDescription(
      itemKey: string,
      defaultItem: TVerifyTemplateDefaultItem
    ) {
      switch (itemKey) {
        case 'file':
          return defaultItem.placeholder
        case 'amount':
          return '申请金额限相同币种，如欲申请多币种请拆单申请！'
        default:
          return ''
      }
    },
    setInputCurrencyType(inputName: string) {
      if (inputName === '收款地址') {
        return 'virtualCurrency'
      }
      const isFiatCurrList = ['收款姓名', '收款银行', '收款帐号']
      if (isFiatCurrList.includes(inputName)) {
        return 'legalTender'
      }
      return ''
    },

    setTemplateCurrencyLValue() {
      return currencyTableData.map(_ => {
        return {
          enName: _.en,
          cnName: _.cn,
          exchangeRate: AppUtils.setRealRate(_.en),
          editRate: ''
        }
      })
    },

    async beforeResetStore() {
      if (this.editingTemplateId != '') {
        // await BaseApi.UnlockVerifyTemplate(this.editingTemplateId)
      }
      await nextTick(() => {
        this.$reset()
        flowStore.$reset()
      })
    },
    setTemplateFilterData(filterData: TGetVerifyTemplatePayload) {
      this.templateIsEdit = true
      this.templateFilterData = filterData
    },
    afterSetFilterData() {
      this.templateIsEdit = false
      this.templateFilterData = {} as TGetVerifyTemplatePayload
    },

    updateNextClickedStatus(visible: boolean) {
      this.nextClickedVisible = visible
    },

    clearStep2ActiveAndData() {
      this.setActiveBorder(9999)
      this.setSettingData({} as TCenterList)
    },

    setCcScopeDrawVisible(visible: boolean) {
      this.scopeCCDrawVisible = visible
    },
    async createVerifyTemplate() {
      // const result = await BaseApi.postVerifyTemplateCreate(
      //   AppUtils.deepCloneData(this.submitPayload)
      // )
      // if (result.code == StatusCodes.OK) {
      //   ElMessage.success('新建成功')
      //   approvalStore.afterAddEditVerifyTemplate()
      // }
    },
    checkStep2List() {
      if (this.centerList.length == 0) {
        ElMessage.error('请先配置模板信息')
        return false
      } else {
        return true
      }
    },
    async editVerifyTemplate() {
      // const result = await BaseApi.postVerifyTemplateEdit(
      //   AppUtils.deepCloneData(this.submitPayload)
      // )
      // if (result.code == StatusCodes.OK) {
      //   if (result.code == 200) {
      //     ElMessage.success('修改成功')
      //     approvalStore.afterAddEditVerifyTemplate()
      //
      //     await this.beforeResetStore()
      //   }
      // }
    },
    checkFlowValueEmpty(isWriteOff: boolean) {
      let hasEmptyFlow = false
      let cloneList
      if (isWriteOff) {
        cloneList = AppUtils.deepCloneData(
          flowStore.storeWriteOffFlowList
        ) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          flowStore.storeFlowList
        ) as TFlowITem[][]
      }
      let vList = [] as TStep3Verify[]
      let cList = [] as TFlowITem[]
      for (let i = 0; i < cloneList.length; i++) {
        const condiList = cloneList[i]
        for (let c = 0; c < condiList.length; c++) {
          if (![MEETPOINT, ENDPOINT].includes(condiList[c].layer)) {
            if (!condiList[c].isElse) {
              cList.push(condiList[c])
            }
            vList.push(...condiList[c].verifyFlowList)
          }
        }
      }
      const emptyFlow = vList.filter(item => item.verifyFlow == '')
      const emptyCond = cList.filter(
        item => !item.pathName || item.pathName == ''
      )

      if (emptyCond.length > 0) {
        ElMessage.warning('请先设定条件')

        hasEmptyFlow = true
      }
      if (emptyFlow.length > 0) {
        ElMessage.warning('请选择审批人')

        hasEmptyFlow = true
      }
      return hasEmptyFlow
    }
  }
})

export const verifyTempStore = VerifyTemplateStore()
