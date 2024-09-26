import dayjs from '@/plugins/dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import calendar from 'dayjs/plugin/calendar'

dayjs.extend(isSameOrBefore)
dayjs.extend(calendar)

export class DateTimeHelperClass {
  dayjs: typeof dayjs

  constructor() {
    this.dayjs = dayjs
  }

  formatDate(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('YYYY/MM/DD')
    }
  }
  dateIsToday(date: Date) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).isToday()
    }
  }

  formatDateDashNextMount(date: Date) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).add(1, 'month').format('YYYY-MM')
    }
  }

  formatDateTimeDash(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  format(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
    }
  }

  formatDash(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  formatAddDash(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss')
    }
  }

  formatHours(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('HH:mm')
    }
  }
  formatMin(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('mm')
    }
  }

  formatDateShort(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(date).format('YY.MM.DD HH:mm')
    }
  }
  formatDateDashShort(date: string) {
    if (!date) {
      return ''
    } else {
      return dayjs(Number(date)).format('YYYY-MM-DD HH:mm')
    }
  }

  formatUTCTime(utcTime: number, formatType = 'HH:mm') {
    return utcTime ? dayjs(Number(utcTime)).format(formatType) : ''
  }

  formatUTCDate(utcTime: number, formatType = 'YYYY/MM/DD') {
    return utcTime ? dayjs(Number(utcTime)).format(formatType) : ''
  }

  // 設定日期格式符合 api 格式 微秒
  formatDateTime(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
  }

  // 設定日期格式符合 api 格式 微秒 -8
  formatReduceDateTime(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime)
        .subtract(8, 'h')
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
  }

  formatEndTodayDateTime(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime)
        .add(1, 'd')
        .subtract(1, 'minute')
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
  }

  formatEndTodayDateTimeToPayload(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime)
        .add(1, 'd')
        .subtract(1, 'second')
        .subtract(8, 'h')
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
  }

  // 設定日期格式符合 api 格式
  formatDateTimeForSec(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime).format('YYYY-MM-DDTHH:mm:ss[Z]')
    }
  }

  formatDateTimeForSecWithoutTz(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  formatDateTimeForSecWithoutTzForTable(dateTime: Date) {
    if (!dateTime) {
      return ''
    } else {
      return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
    }
  }

  // utc + 8
  formatUTCDateTime(dateTime: number) {
    const format = 'YYYY-MM-DD HH:mm:ss'
    if (!dateTime) {
      return ''
    }
    return dayjs(dateTime).tz('Asia/Taipei').format(format)
  }

  // xx月xx日
  msgCreateDateFormat(inputTime: number, lastTime: number) {
    const timeString = dayjs(inputTime).format('YYYY-MM-DD')
    const lastTimeString = lastTime ? dayjs(lastTime).format('YYYY-MM-DD') : ''

    const day = 1000 * 60 * 60 * 24
    const time1 = new Date(timeString).getTime()
    const time2 = !lastTimeString ? 0 : new Date(lastTimeString).getTime()
    const isCrossDay = time1 - time2

    if (isCrossDay >= day) {
      const diffTime = Date.now() - time1
      if (diffTime <= day) {
        return '今天'
      } else if (diffTime <= 2 * day) {
        return '昨天'
      } else if (diffTime <= 7 * day) {
        return Math.floor(diffTime / day) + '天前'
      } else {
        return dayjs(inputTime).format('M月DD日')
      }
    }
    return ''
  }

  //*
  // - 剩余N分＝1分钟(含)以上～59分钟(含)以下
  //
  // - 剩余N小时＝60分钟(含)以上～23小时(含)以下
  //
  // - 剩余N天＝24小时(含)以上～7天(含)以下
  //
  // - 完整时间＝ 大于7天则显示完整问卷时间
  // YYYY/MM/DD HH:MM ~ YYYY/MM/DD HH:MM
  //
  // *//
  questionnaireDateFormat(startTime: string, endTime: string) {
    const startTimeString = dayjs(startTime).format('YYYY-MM-DD HH:mm')
    const endTimeString = dayjs(endTime).format('YYYY-MM-DD HH:mm')
    const min = 1000 * 60
    const hour = 1000 * 60 * 60
    const day = 1000 * 60 * 60 * 24
    const week = 7 * 1000 * 60 * 60 * 24
    const time2 = new Date(endTimeString).getTime()
    const now = new Date().getTime()
    const lestDateTime = time2 - now

    if (lestDateTime < week) {
      if (lestDateTime >= day) {
        return {
          label: `剩馀 ${Math.floor(lestDateTime / day)} 天`,
          value: 'day'
        }
      } else if (lestDateTime >= hour && lestDateTime <= 23 * hour) {
        return {
          label: `剩馀 ${Math.floor(lestDateTime / hour)} 小时`,
          value: 'hour'
        }
      } else if (lestDateTime < hour) {
        if (Math.floor(lestDateTime / min) < 0) {
          return {
            label: `${startTimeString} ～ ${endTimeString}`,
            value: 'date'
          }
        }
        return {
          label: `剩馀 ${Math.floor(lestDateTime / min)} 分钟`,
          value: 'min'
        }
      }
    }
    return {
      label: `${startTimeString} ～ ${endTimeString}`,
      value: 'date'
    }
  }
}

export const dateTimeHelper = new DateTimeHelperClass()
