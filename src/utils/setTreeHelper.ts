import {
  TDeptPlatform,
  TGetDeviceTree,
  TGetRoleDetailTree,
  TGetTESTTreeOption,
  TGetTreeManagement,
  TGetUserTree,
  TRowData,
  TUserTreeVoList,
  TVerifyPeoples
} from '@/types/apiTypes'
import AppUtils from '@/utils/appUtils'

export type TFooter = {
  id: string
  label: string
  tabName: string
  layer?: string
}

export class SetTreeHelperClass {
  collectValidId(arr: TGetDeviceTree[], ids: string[] = []) {
    arr.forEach(_ => {
      if (_.isValid) {
        ids.push(_.menuId)
      }
      if (_.children) {
        this.collectValidId(_.children, ids)
      }
    })
    return ids
  }
  collectDeviceValidId(
    arr: TGetDeviceTree[],
    ids: string[] = [],
    parentIds: string[] = []
  ) {
    arr.forEach(_ => {
      if (_.isValid) {
        ids.push(_.menuId)
        parentIds.push(_.parentId)
      }
      if (_.children) {
        this.collectDeviceValidId(_.children, ids, parentIds)
      }
    })
    return [...ids, ...parentIds]
  }

  collectValidItems(
    arr: TGetRoleDetailTree[],
    items: TGetRoleDetailTree[] = []
  ) {
    arr.forEach(_ => {
      if (_.isValid) {
        items.push(_)
      }
      if (_.children) {
        this.collectValidItems(_.children, items)
      }
    })
    return items
  }

  collectFilterChildrenNoShow(
    arr: TGetDeviceTree[],
    data: TGetDeviceTree[] = []
  ) {
    data = arr.filter(_ => _.isShow)
    data.forEach((_, idx) => {
      if (_.children) {
        data[idx].children = _.children.filter(_ => _.isShow)
      }
    })
    return data
  }

  collectFilterCanShowID(arr: TGetDeviceTree[], ids: string[] = []) {
    arr.forEach(_ => {
      if (_.isShow) {
        ids.push(_.menuId)
      }
      if (_.children) {
        this.collectFilterCanShowID(_.children, ids)
      }
    })
    return ids
  }

  setTreeData(arr: TGetTreeManagement[]) {
    arr.map(item => {
      item['label'] = item.label
      item['value'] = item.id
      if (item.children) {
        this.setTreeData(item.children!)
      } else {
        item['isLeaf'] = true
      }
      return item
    })
    return arr
  }
  setTreeDataDisabled(arr: TGetUserTree[], isDisable: boolean = true) {
    arr.map(item => {
      item['label'] = item.label
      item['id'] = item.id
      item['disabled'] = isDisable

      if (item.children) {
        this.setTreeDataDisabled(item.children!, isDisable)
      } else {
        item['isLeaf'] = true
      }
      return item
    })
    return arr
  }
  setV2TreeData(
    arr: TGetTESTTreeOption[] = [],
    childrenList: TGetTESTTreeOption[]
  ) {
    arr.forEach(p => {
      p.children = childrenList.filter(c => c.parentId == p.value)
      this.setV2TreeData(p.children, childrenList)
    })
    return arr
  }

  setTreeDataDisabledDept(arr: TGetTreeManagement[]) {
    arr.map(item => {
      item['label'] = item.label
      item['value'] = item.id
      item['disabled'] = true
      if (item.children!.length > 0) {
        this.setTreeDataDisabledDept(item.children!)
      } else {
        item['isLeaf'] = true
      }
      return item
    })
    return arr
  }

  setTreeDataDisabledDevice(arr: TGetDeviceTree[]) {
    arr.map(item => {
      item['disabled'] = true
      if (item.children!) {
        item['disabled'] = true
        this.setTreeDataDisabledDevice(item.children!)
      }
      return item
    })
    return arr
  }

  approvalFilterTree(
    arr: TGetUserTree[],
    keyword: string,
    data: TGetUserTree[] = []
  ) {
    arr.forEach((_, idx) => {
      if (_.label.toLowerCase().includes(keyword)) {
        data.push(arr[idx])
      } else {
        if (arr[idx].children != null) {
          this.approvalFilterTree(arr[idx].children!, keyword, data)
        }
      }
    })
    return data
  }

  approvalFilterTreeGetVOList(
    arr: TGetUserTree[],
    data: TUserTreeVoList[] = []
  ) {
    arr.forEach((_, idx) => {
      data.push(..._.userTreeVOList)
      if (arr[idx].children) {
        this.approvalFilterTreeGetVOList(arr[idx].children!, data)
      }
    })
    return data
  }

  conditionFilterDeptID(
    arr: TGetUserTree[],
    departId: string,
    data: TGetUserTree[] = []
  ) {
    arr.forEach(_ => {
      if (_.id == departId) {
        data.push(_)
      }
      if (_.children) {
        this.conditionFilterDeptID(_.children, departId, data)
      }
    })
    if (data.length > 0) {
      return data[0]
    } else {
      return {} as TGetUserTree
    }
  }

  verifyFilterTreeGetMember(
    arr: TUserTreeVoList[],
    ids: string[],
    data: TVerifyPeoples[] = []
  ) {
    const setObj = new Set()

    arr.forEach(_ => {
      ids.forEach(id => {
        if (_.userId == id) {
          data.push({
            userId: _.userId,
            userName: _.realName
          })
        }
      })
    })
    return data.filter(itm =>
      !setObj.has(itm.userId) ? setObj.add(itm.userId) : false
    ) as { userId: string; userName: string }[]
  }

  setDeptTableData(arr: TRowData[]) {
    arr.forEach(rowData => {
      if (rowData.deptId == '1') {
        rowData.tagNames = []
        rowData.platformNames = []
        rowData.memo = '-'
        rowData.deptOwnerName = '-'
      } else {
        rowData.tagNames = rowData.deptTags.map(tag => tag.name)
        const clonePlat = AppUtils.deepCloneData(
          rowData.platforms
        ) as TDeptPlatform[]
        rowData.platformNames = clonePlat.map(plat => {
          //0啟用 // 1關閉
          if (plat.enabledStatus == '1') {
            plat.platName = `${plat.platName}(停用)`
          }
          return plat.platName
        })
      }
      rowData.areaName = rowData.deptArea ? rowData.deptArea.name : ''

      if (rowData.children) {
        this.setDeptTableData(rowData.children)
      }
    })

    return arr
  }
  getParentNames(
    arr: TRowData[],
    parentId: string,
    parentNames: string[] = []
  ) {
    arr.forEach(item => {
      if (item.deptId == parentId) {
        let parentNameStr = item.parentNameRecursion
        parentNames.push(...parentNameStr.split('/'))
      } else {
        if (item.children) {
          this.getParentNames(item.children, parentId, parentNames)
        }
      }
    })
    return parentNames
  }

  getParentIds(
    arr: TRowData[],
    parentNames: string[],
    parentIds: string[] = []
  ) {
    arr.forEach(item => {
      if (item.children) {
        this.getParentIds(item.children, parentNames, parentIds)
      }

      for (const name of parentNames) {
        if (item.deptName == name) {
          parentIds.push(item.deptId)
        }
      }
    })
    return parentIds
  }

  findSearchRows(arr: TRowData[], keyword: string, ids: string[] = []) {
    const lowerKeyword = keyword.toLowerCase()
    arr.forEach(item => {
      const lowerDeptName = item.deptName.toLowerCase()
      if (item.children) {
        this.findSearchRows(item.children, keyword, ids)
      }
      if (lowerDeptName.includes(lowerKeyword)) {
        ids.push(item.parentId)
      }
    })
    return ids
  }
}

export const treeHelper = new SetTreeHelperClass()
