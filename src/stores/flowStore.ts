import { defineStore } from 'pinia'
import {
  TConditionCC,
  TFlowITem,
  TGetTemplateByIDV4,
  TStep3Verify,
  TVerifyPeoples
} from '@/types/apiTypes'
import AppUtils from '@/utils/appUtils'
import { MarkerType } from '@vue-flow/core'
import { ENDPOINT, MEETPOINT, meetObject } from '@/const/appConst'
import { TFooter } from '@/utils/setTreeHelper'
import { verifyTempStore } from '@/stores/verifyTemplateStore'

const defaultVerifyCardValue = {
  // 新增的 verify card
  verifyFlow: '',
  verifyPeople: [],
  verifyNameList: []
} as TStep3Verify

const defineFlowItem = {
  layer: '0',
  priority: '0',
  path: '',
  condition: '',
  value: '',
  verifyFlowList: [
    {
      verifyFlow: '',
      verifyPeople: [],
      verifyNameList: []
    }
  ],
  copyFlow: {
    copyTarget: [],
    copyTargetPosition: [],
    copyTargetDept: []
  }
}

const cardWidth = 318
const cardH = 110
const ySpan = 110
const xSpan = 30
const startX = (window.innerWidth - 176) / 2 - cardWidth / 2
const startY = 16
const defaultStyle = {
  borderColor: 'transparent',
  padding: '0',
  width: '320px'
}

const calcYNum = (index: number = 1) => {
  return startY + (ySpan + cardH) * index
}
const calcXNum = (xLeng: number = 1, ind: number) => {
  const totalW = cardWidth * xLeng + xSpan * (xLeng - 1)
  const halfTotalW = totalW / 2
  return (
    (window.innerWidth - 176) / 2 + cardWidth * ind + xSpan * ind - halfTotalW
  )
}
let defineData: any
const FlowStore = defineStore('flowStore', {
  state: () => ({
    nodes: [
      {
        id: '1',
        type: 'input',
        label: 'Node 1',
        position: { x: startX, y: startY },
        style: defaultStyle,
        data: defineData
      },
      {
        // 操送人
        id: '2',
        type: 'output',
        position: { x: startX + cardWidth, y: startY },
        style: {
          borderColor: 'transparent',
          padding: '0',
          width: '384px',
          background: 'transparent'
        },
        data: defineData
      }

      // 審批人扁平化
    ],

    writeOffNodes: [
      {
        id: '1',
        type: 'input',
        label: 'Node 1',
        position: { x: startX, y: startY },
        style: defaultStyle,
        data: defineData
      }

      // 核銷 審批人扁平化
    ],

    edges: [], //審批人 line
    writeOffEdges: [], // 核銷 審批人 line

    storeFlowList: [] as TFlowITem[][],
    storeWriteOffFlowList: [] as TFlowITem[][],
    flowNodeLoading: false,

    pureFlowItem: {} as TStep3Verify,

    settingCondition: {} as TFlowITem,
    selectTreeDept: [] as TFooter[]
  }),
  getters: {},
  actions: {
    setDefaultFlowList(isWriteOff: boolean) {
      let insertMeetPointList = this.insertObjectBetweenLists(
        [[defineFlowItem]],
        meetObject
      )
      if (isWriteOff) {
        this.setItemId(insertMeetPointList, true)
      } else {
        this.setItemId(insertMeetPointList, false)
      }
    },
    addNewFlowCard(
      flowIndex: number,
      addAfter: boolean = false,
      isWriteOff: boolean
    ) {
      let cloneList: TFlowITem[][]
      if (isWriteOff) {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      }

      if (addAfter) {
        cloneList.splice(flowIndex + 1, 0, [
          AppUtils.deepCloneData(defineFlowItem)
        ])
      } else {
        cloneList.splice(flowIndex, 0, [AppUtils.deepCloneData(defineFlowItem)])
      }

      this.setItemId(cloneList, isWriteOff)
    },
    addNewConditionItem(flowIndex: number, isWriteOff: boolean) {
      let cloneList
      if (isWriteOff) {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      }
      const condiLen = cloneList[flowIndex].length
      cloneList[flowIndex].splice(
        condiLen - 1,
        0,
        AppUtils.deepCloneData(defineFlowItem)
      )
      this.forConditionFlowData(cloneList, flowIndex, isWriteOff)
    },
    addNewConditionFlow(
      flowIndex: number,
      addAfter: boolean = false,
      isWriteOff: boolean
    ) {
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }
      let newConditionArr = [
        AppUtils.deepCloneData(defineFlowItem),
        AppUtils.deepCloneData(defineFlowItem)
      ]

      if (addAfter) {
        cloneList.splice(flowIndex + 1, 0, newConditionArr)
        this.forConditionFlowData(cloneList, flowIndex + 1, isWriteOff)
      } else {
        cloneList.splice(flowIndex, 0, newConditionArr)
        this.forConditionFlowData(cloneList, flowIndex, isWriteOff)
      }
    },
    forConditionFlowData(
      arr: TFlowITem[][],
      flowIndex: number,
      isWriteOff: boolean
    ) {
      const cloneList = AppUtils.deepCloneData(arr) as TFlowITem[][]
      cloneList[flowIndex].forEach((item, ind) => {
        item.priority = ind.toString()
        item.condition = item.condition == '' ? ind.toString() : item.condition
      })
      let insertMeetPointList = this.insertObjectBetweenLists(
        cloneList,
        AppUtils.deepCloneData(meetObject)
      )
      this.setItemId(insertMeetPointList, isWriteOff)
    },
    setNewTypeFlow(editData: TGetTemplateByIDV4) {
      if (editData.verifyLevelConditionFlowList != '[]') {
        const verifyFlow = JSON.parse(
          editData.verifyLevelConditionFlowList
        ) as TFlowITem[][]

        let insertMeetPointList = this.insertObjectBetweenLists(
          verifyFlow,
          meetObject
        )
        this.setItemId(insertMeetPointList, false)
      }

      if (verifyTempStore.verifyTWriteOff) {
        if (
          editData.writeOffVerifyLevelConditionFlowList !== '' &&
          editData.writeOffVerifyLevelConditionFlowList != '[]'
        ) {
          const writeOffFlow = JSON.parse(
            editData.writeOffVerifyLevelConditionFlowList
          ) as TFlowITem[][]

          let insertMeetPointList = this.insertObjectBetweenLists(
            writeOffFlow,
            meetObject
          )

          this.setItemId(insertMeetPointList, true)
        } else {
          this.setDefaultFlowList(true)
        }
      }
    },
    updateConditionFromStep2(itemId: string) {
      const cloneList = AppUtils.deepCloneData(
        this.storeFlowList
      ) as TFlowITem[][]
      const cloneWriteOffList = AppUtils.deepCloneData(
        this.storeWriteOffFlowList
      ) as TFlowITem[][]

      let flowGetCondition = this.findConditionItemId(cloneList, itemId)
      let writeOffFlowGetCondition = this.findConditionItemId(
        cloneWriteOffList,
        itemId
      )

      return flowGetCondition || writeOffFlowGetCondition
    },
    findConditionItemId(arr: TFlowITem[][], itemId: string) {
      let getConditionPath = false
      arr.forEach(condList => {
        if (condList.length > 1) {
          condList.forEach(item => {
            if (item.path == itemId) {
              getConditionPath = true
            }
          })
        }
      })
      return getConditionPath
    },

    insertObjectBetweenLists(data: TFlowITem[][], newObject: TFlowITem) {
      const cloneList = AppUtils.deepCloneData(data)
      let pureFlowList = []
      for (let i = 0; i < cloneList.length; i++) {
        if (cloneList[i][0].layer !== MEETPOINT) {
          pureFlowList.push(cloneList[i])
        }
      }
      for (let i = 0; i < pureFlowList.length; i++) {
        const conditionList = pureFlowList[i]
        let insertNewObject = false
        // 遍历每个条件层的条件体
        for (let j = 0; j < conditionList.length; j++) {
          const flowObj = conditionList[j]

          if (flowObj.condition !== '') {
            insertNewObject = true
            break // 跳出当前条件层循环，避免在插入后再次检查
          }
        }
        if (insertNewObject) {
          // 插入新物件到大陣列的当前条件层之前
          pureFlowList.splice(i, 0, [AppUtils.deepCloneData(newObject)])
          // 由于已经插入了新物件，增加索引以跳过刚插入的物件
          i++
        }
      }
      const cloneNewObj = AppUtils.deepCloneData(newObject) as TFlowITem
      cloneNewObj.is_end = true
      cloneNewObj.layer = ENDPOINT
      cloneNewObj.cardType = 'output'
      cloneNewObj.verifyFlowList[0].verifyFlow = ENDPOINT
      cloneNewObj.verifyFlowList[0].cardType = 'output'
      cloneNewObj.verifyFlowList[0].is_end = true

      if (pureFlowList[pureFlowList.length - 1][0].is_end) {
        if (pureFlowList[pureFlowList.length - 2].length > 1) {
          const cloneFlow = AppUtils.deepCloneData(pureFlowList)
          cloneFlow.pop()
          return [
            ...cloneFlow,
            [AppUtils.deepCloneData(newObject)],
            [cloneNewObj]
          ]
        }
        return [...pureFlowList]
      } else {
        return [...pureFlowList, [cloneNewObj]]
      }
    },
    setItemId(arr: TFlowITem[][], isWriteOff: boolean) {
      let flowList = AppUtils.deepCloneData(arr) as TFlowITem[][]
      let conditionLeng = 1
      let maxLeng = 1
      let showCondition = false
      flowList.forEach((condList, ind) => {
        condList.forEach((item, index) => {
          if (item.verifyFlowList.length >= maxLeng) {
            maxLeng = item.verifyFlowList.length
          }
          item.id = `${ind}-${index}`

          item.xIndex = index + 1
          item.isElse = index == condList.length - 1
          //橫向條件 0-0
          if (item.condition !== '') {
            item.x = calcXNum(condList.length, index)
            item.y = calcYNum(conditionLeng)
            item.indexInFlow = ind
            showCondition = true
          }
          item.isCondition = item.condition !== ''
          item.target = item.id

          item.verifyFlowList.forEach((flow, flowInd) => {
            flow.id = `${ind}-${index}-${flowInd}`
            //直向審批卡片 0-0-0
            flow.isCondition = false
            flow.indexInFlow = ind

            flow.x = calcXNum(condList.length, index)

            if (!item.isCondition) flow.y = calcYNum(conditionLeng + flowInd)
            else flow.y = calcYNum(conditionLeng + flowInd + 1)

            if (flow.verifyFlow === MEETPOINT) {
              flow.x = calcXNum(condList.length, index)
              flow.y = calcYNum(conditionLeng)
            }
            if (flow.verifyPeople.length > 0) {
              flow.verifyNameList = flow.verifyPeople.map(
                user => user.userName
              ) as string[]
            }

            flow.target = flow.id
            flow.isTheLast = flowInd == item.verifyFlowList.length - 1
          })

          if (index == condList.length - 1) {
            if (showCondition) {
              conditionLeng += 1
              showCondition = false
            }
            conditionLeng += maxLeng
            maxLeng = 1
          }
        })
      })

      const getIdList = AppUtils.deepCloneData(flowList) as TFlowITem[][]
      const getSourceList = this.setSource(getIdList)
      this.setStoreFlowList(getSourceList, isWriteOff)
    },

    setStoreFlowList(arr: TFlowITem[][], isWriteOff: boolean) {
      if (!isWriteOff) {
        const cloneList = AppUtils.deepCloneData(arr) as TFlowITem[][]
        this.storeFlowList = cloneList
        const beforeNodeList = this.pushToNodeData(cloneList)
        this.setDataToNodeType(beforeNodeList)
      } else {
        const cloneList = AppUtils.deepCloneData(arr) as TFlowITem[][]
        this.storeWriteOffFlowList = cloneList
        const beforeNodeList = this.pushToNodeData(cloneList)
        this.setWriteOffDataToNodeType(beforeNodeList)
      }
    },

    setWriteOffDataToNodeType(arr: any[]) {
      const nodeList = arr.map(item => {
        const dataStyle = AppUtils.deepCloneData(defaultStyle)
        if (item.verifyFlow && item.verifyFlow == MEETPOINT) {
          dataStyle.background = 'transparent'
        }
        return {
          id: item.id,
          position: { x: item.x, y: item.y },
          style: dataStyle,
          data: item,
          type: item.cardType
        }
      })
      this.flowNodeLoading = true

      const cloneWriteOffNodeList = AppUtils.deepCloneData(this.writeOffNodes)
      const writeOffNodeWithoutFlowCards = cloneWriteOffNodeList.filter(
        (item: any) => ['1'].includes(item.id)
      )
      this.writeOffNodes = [...writeOffNodeWithoutFlowCards]
      this.writeOffEdges = []

      setTimeout(() => {
        this.writeOffNodes = [...writeOffNodeWithoutFlowCards, ...nodeList]
        const cloneWriteOffList = AppUtils.deepCloneData(this.writeOffNodes)

        const writeOffOnlyFlowList = cloneWriteOffList.filter(
          (item: any) => !['1'].includes(item.id)
        )

        this.drawLine(writeOffOnlyFlowList, true)
      }, 300)
    },
    setCcCardOption() {
      const cloneNewObj = AppUtils.deepCloneData(meetObject) as TFlowITem
      cloneNewObj.is_end = false
      cloneNewObj.cardType = 'output'
      cloneNewObj.layer = 'cc'
      cloneNewObj.verifyFlowList[0].is_end = false
      cloneNewObj.verifyFlowList[0].cardType = 'output'
      cloneNewObj.verifyFlowList[0].layer = 'cc'
      cloneNewObj.verifyFlowList[0].verifyFlow = 'cc'
      cloneNewObj.verifyFlowList[0].copyFlow = AppUtils.deepCloneData(
        cloneNewObj.copyFlow
      ) as TConditionCC
      return cloneNewObj
    },
    setDataToNodeType(arr: any[]) {
      const nodeList = arr.map(item => {
        const dataStyle = AppUtils.deepCloneData(defaultStyle)
        if (item.verifyFlow) {
          if (item.verifyFlow == MEETPOINT) {
            dataStyle.background = 'transparent'
          }
          if (item.verifyFlow == 'cc') {
            const newCcObj = this.setCcCardOption()
            const ccItem = AppUtils.deepCloneData(newCcObj).verifyFlowList[0]
            item = { ...ccItem, ...item }
          }
        }
        return {
          id: item.id,
          position: { x: item.x, y: item.y },
          style: dataStyle,
          data: item,
          type: item.verifyFlow == 'cc' ? 'output' : item.cardType
        }
      })
      this.flowNodeLoading = true

      const cloneNodeList = AppUtils.deepCloneData(this.nodes)
      const withoutFlowCards = cloneNodeList.filter((item: any) =>
        ['1', '2'].includes(item.id)
      )
      this.nodes = [...withoutFlowCards]
      this.edges = []

      setTimeout(() => {
        //@ts-ignore
        this.nodes = [...withoutFlowCards, ...nodeList]
        const cloneList = AppUtils.deepCloneData(this.nodes)
        const onlyFlowList = cloneList.filter(
          (item: any) => !['1', '2'].includes(item.id)
        )
        this.drawLine(onlyFlowList, false)
      }, 300)
    },
    pushToNodeData(arr: TFlowITem[][]) {
      let nodeList = [] as any[]
      arr.forEach(condList => {
        condList.forEach(item => {
          if (item.condition !== '') {
            nodeList.push(item)
          }

          item.verifyFlowList.forEach(flow => {
            if (flow.verifyFlow == 'cc') {
              flow.copyFlow = item.copyFlow
            }
            nodeList.push(flow)
          })
        })
      })
      return nodeList
    },
    setSource(flowList: TFlowITem[][]) {
      const list = AppUtils.deepCloneData(flowList) as TFlowITem[][]
      for (let i = 0; i < list.length; i++) {
        let currentLayer = list[i]
        let previousLayer = list[i - 1] || []

        let previousLastCardIds: string[] = []
        if (previousLayer.length > 0) {
          previousLayer.forEach(layerItem => {
            let lastCard = layerItem.verifyFlowList.slice(-1)[0]
            if (lastCard) {
              previousLastCardIds.push(lastCard.id!)
            }
            if (layerItem.verifyFlowList.length == 0) {
              previousLastCardIds.push(layerItem.id!)
            }
          })
        }

        for (let j = 0; j < currentLayer.length; j++) {
          let currentObject = currentLayer[j]
          const setSource = (ids: string[]) => {
            for (let c = 0; c < currentObject.verifyFlowList.length; c++) {
              currentObject.verifyFlowList[c].source = ids
            }
          }

          if (i === 0) {
            // 第一层
            if (currentObject.condition === '') {
              setSource(['1'])
            } else {
              if (previousLayer.length > 0) {
                let lastCard =
                  previousLayer[previousLayer.length - 1].verifyFlowList.slice(
                    -1
                  )[0]
                if (lastCard) {
                  currentObject.source = [lastCard.id!]
                }
                setSource([currentObject.id!])

                for (let k = 1; k < currentObject.verifyFlowList.length; k++) {
                  currentObject.verifyFlowList[k].source = [
                    currentObject.verifyFlowList[k - 1].id!
                  ]
                }
              } else {
                currentObject.source = ['1']
                setSource([currentObject.id!])
              }
            }
          } else {
            if (currentObject.condition === '') {
              if (previousLastCardIds.length > 0) {
                setSource(previousLastCardIds)
              }
            } else {
              if (previousLastCardIds.length > 0) {
                currentObject.source = previousLastCardIds

                setSource([currentObject.id!])

                for (let k = 1; k < currentObject.verifyFlowList.length; k++) {
                  currentObject.verifyFlowList[k].source = [
                    currentObject.verifyFlowList[k - 1].id!
                  ]
                }
              }
            }
            let isMeetCard = currentObject.verifyFlowList.find(
              verifyFlowItem => verifyFlowItem.verifyFlow === MEETPOINT
            )
            if (currentObject.layer === MEETPOINT && isMeetCard) {
              if (previousLastCardIds.length > 0) {
                setSource(previousLastCardIds)
              }
            }
          }
        }
      }
      return list
    },

    drawLine(arr: any[], isWriteOff: boolean) {
      let edges = [] as any[]

      if (!isWriteOff) {
        arr.forEach(item => {
          if (item.data.source.length > 1) {
            for (let i = 0; i < item.data.source.length; i++) {
              edges.push({
                id: `${item.data.source[i]}_to_${item.data.target}`,
                source: item.data.source[i],
                target: item.data.target,
                type: 'custom',
                markerEnd: MarkerType.ArrowClosed
              })
            }
          } else {
            edges.push({
              id: `${item.data.source[0]}_to_${item.data.target}`,
              source: item.data.source[0],
              target: item.data.target,
              type: 'custom',
              markerEnd: MarkerType.ArrowClosed
            })
          }
        })

        //@ts-ignore
        this.edges = [...edges]
      } else {
        arr.forEach(item => {
          if (item.data.source.length > 1) {
            for (let i = 0; i < item.data.source.length; i++) {
              edges.push({
                id: `${item.data.source[i]}_to_${item.data.target}`,
                source: item.data.source[i],
                target: item.data.target,
                type: 'custom',
                markerEnd: MarkerType.ArrowClosed
              })
            }
          } else {
            edges.push({
              id: `${item.data.source[0]}_to_${item.data.target}`,
              source: item.data.source[0],
              target: item.data.target,
              type: 'custom',
              markerEnd: MarkerType.ArrowClosed
            })
          }
        })
        //@ts-ignore
        this.writeOffEdges = [...edges]
      }

      this.flowNodeLoading = false
    },

    // 審批人邏輯
    updateCloneFlowData(afterSetData: TStep3Verify, isWriteOff: boolean) {
      const flowPathList = afterSetData
        .id!.split('-')
        .map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }

      let conditionList = cloneList[flowPathList[0]]
      let conditionObj = conditionList[flowPathList[1]]
      let flowItem = conditionObj.verifyFlowList[flowPathList[2]]
      if (flowItem) {
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[
          flowPathList[2]
        ] = { ...afterSetData }
      }
      this.setStoreFlowList(cloneList, isWriteOff)
    },
    deleteFlowITem(itemId: string, isWriteOff: boolean) {
      const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }

      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.splice(
        flowPathList[2],
        1
      )
      if (
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.length ==
          0 &&
        cloneList[flowPathList[0]].length == 1
      ) {
        cloneList[flowPathList[0]].splice(flowPathList[1], 1)
      }

      const afterSetFullList = cloneList.filter(item => item.length > 0)

      let insertMeetPointList = this.insertObjectBetweenLists(
        afterSetFullList,
        meetObject
      )
      this.setItemId(insertMeetPointList, isWriteOff)
    },
    // 條件內的cc 邏輯
    addCCInCondition(itemId: string, isWriteOff: boolean) {
      const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }

      const newCcObj = this.setCcCardOption()
      const ccItem = AppUtils.deepCloneData(newCcObj).verifyFlowList[0]
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.push(ccItem)
      this.setItemId(cloneList, isWriteOff)
    },
    addFlowInCondition(
      itemId: string,
      isBottom: boolean = false,
      isWriteOff: boolean
    ) {
      const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }
      if (
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.length == 0
      ) {
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.push(
          AppUtils.deepCloneData(defaultVerifyCardValue)
        )
      } else {
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.splice(
          isBottom ? flowPathList[2] + 1 : flowPathList[2],
          0,
          AppUtils.deepCloneData(defaultVerifyCardValue)
        )
      }

      this.setItemId(cloneList, isWriteOff)
    },
    setConditionCCData(arr: TFooter[], isWriteOff: boolean) {
      const deptList = arr.filter(item => item.tabName == 'dept')
      const memberList = arr.filter(item => item.tabName == 'member')
      const postList = arr.filter(item => item.tabName == 'post')
      const conditionCcMember = memberList.map(user => {
        return { userId: user.id, userName: user.label }
      })
      let conditionCcPost = postList.map(post => {
        return {
          id: post.id,
          name: post.label
        }
      })
      let conditionCcDept = deptList.map(post => {
        return {
          id: post.id,
          name: post.label
        }
      })
      const flowCcObj = {
        copyTarget:
          conditionCcMember.length > 0
            ? AppUtils.deepCloneData(conditionCcMember)
            : [],
        copyTargetPosition:
          conditionCcPost.length > 0
            ? AppUtils.deepCloneData(conditionCcPost)
            : [],
        copyTargetDept:
          conditionCcDept.length > 0
            ? AppUtils.deepCloneData(conditionCcDept)
            : []
      } as TConditionCC
      const nowCCId = verifyTempStore.settingCcId
      const flowPathList = nowCCId
        .split('-')
        .map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }

      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[
        flowPathList[2]
      ].copyFlow = flowCcObj
      cloneList[flowPathList[0]][flowPathList[1]].copyFlow = flowCcObj
      this.setItemId(cloneList, isWriteOff)
    },
    getNowConditionCCObj(itemId: string, isWriteOff: boolean) {
      const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }
      let condiCCObj = cloneList[flowPathList[0]][flowPathList[1]]
        .verifyFlowList[flowPathList[2]].copyFlow as TConditionCC

      const deptList = AppUtils.deepCloneData(condiCCObj.copyTargetDept) as {
        id: string
        name: string
      }[]
      const memberList = AppUtils.deepCloneData(
        condiCCObj.copyTarget
      ) as TVerifyPeoples[]
      const postList = AppUtils.deepCloneData(
        condiCCObj.copyTargetPosition
      ) as {
        id: string
        name: string
      }[]
      const deptNameList = deptList.map(dp => dp.name)
      const memberNameList = memberList.map(mem => mem.userName)
      const postNameList = postList.map(po => po.name)

      return [...deptNameList, ...memberNameList, ...postNameList]
    },
    //條件邏輯
    delConditionFlow(condID: string, isWriteOff: boolean) {
      const flowPathList = condID.split('-').map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }
      cloneList[flowPathList[0]].splice(flowPathList[1], 1)
      if (cloneList[flowPathList[0]].length == 1) {
        cloneList.splice(flowPathList[0], 1)
      }
      let insertMeetPointList = this.insertObjectBetweenLists(
        cloneList,
        meetObject
      )
      this.setItemId(insertMeetPointList, isWriteOff)
    },
    nowSettingCondition(conditionID: string, isWriteOff: boolean) {
      const flowPathList = conditionID
        .split('-')
        .map(str => Number(str)) as number[]
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }
      this.settingCondition = cloneList[flowPathList[0]][flowPathList[1]]
    },

    conditionDeptTreeSelect(data: TFooter[]) {
      this.selectTreeDept = data
    },
    updateConditionDataIntoList(
      afterSetCondition: TFlowITem,
      isWriteOff: boolean
    ) {
      this.settingCondition = {} as TFlowITem
      let cloneList
      if (!isWriteOff) {
        cloneList = AppUtils.deepCloneData(this.storeFlowList) as TFlowITem[][]
      } else {
        cloneList = AppUtils.deepCloneData(
          this.storeWriteOffFlowList
        ) as TFlowITem[][]
      }

      const flowPathList = afterSetCondition
        .id!.split('-')
        .map(str => Number(str)) as number[]
      cloneList[flowPathList[0]][flowPathList[1]] = afterSetCondition

      let insertMeetPointList = this.insertObjectBetweenLists(
        cloneList,
        meetObject
      )
      this.setItemId(insertMeetPointList, isWriteOff)
    },
    setPayloadFlowList(arr: TFlowITem[][]) {
      const cloneList = AppUtils.deepCloneData(arr) as TFlowITem[][]
      const data = cloneList.filter(
        condList => ![ENDPOINT, MEETPOINT].includes(condList[0].layer)
      )
      data.forEach(condList => {
        condList.forEach(cond => {
          delete cond.id
          delete cond.x
          delete cond.y
          delete cond.isCondition
          delete cond.isElse
          delete cond.xIndex
          delete cond.source
          delete cond.target
          delete cond.indexInFlow
          delete cond.cardType
          delete cond.is_end
          delete cond.isConditionEnd
          cond.verifyFlowList.forEach(flow => {
            delete flow.verifyNameList
            delete flow.index
            delete flow.id
            delete flow.x
            delete flow.y
            delete flow.isCondition
            delete flow.source
            delete flow.target
            delete flow.indexInFlow
            delete flow.is_end
            delete flow.isTheLast
            delete flow.cardType
            delete flow.copyFlow
            delete flow.isConditionEnd
          })
        })
      })
      return data
    }
  }
})

export const flowStore = FlowStore()
