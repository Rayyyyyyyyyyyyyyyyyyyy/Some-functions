export type TNodeData = {
  is_active_card: boolean
}

export type TNode = {
  id: string
  type: string
  data: TNodeData // 完全客製
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
  label: string
}
