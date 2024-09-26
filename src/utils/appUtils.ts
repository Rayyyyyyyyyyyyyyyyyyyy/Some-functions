import file_audio from '@/assets/images/fileImages/file_audio.png'
import file_file from '@/assets/images/fileImages/file_file.png'
import file_img from '@/assets/images/fileImages/file_img.png'
import file_pdf from '@/assets/images/fileImages/file_pdf.png'
import file_ppt from '@/assets/images/fileImages/file_ppt.png'
import file_vedio from '@/assets/images/fileImages/file_vedio.png'
import file_word from '@/assets/images/fileImages/file_word.png'
import file_xls from '@/assets/images/fileImages/file_xls.png'
import { emojiList } from '@/const/emoji'
import axios from 'axios'
import { verifyTempStore } from '@/stores/verifyTemplateStore'

const AppUtils = {
  // 將api資料組合成絕對路徑
  getFileUrl(groupName: string, fileId: string) {
    if (!groupName || !fileId) {
      return ''
    }
    //@ts-ignore
    return import.meta.env.VITE_RES_URL + '/' + groupName + '/' + fileId
  },

  // 根据 url 获取图片
  handleShowAvatar(url: string) {
    //@ts-ignore
    return /^https?/.test(url) ? url : `${import.meta.env.VITE_RES_URL}${url}`
  },

  downloadFile(url: string, file_name: string) {
    axios({
      method: 'get',
      responseType: 'blob',
      url: url
    })
      .then(res => {
        const blob = new Blob([res.data])
        const fileURL = window.URL.createObjectURL(blob)
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', file_name)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
      .catch(err => {
        console.log('err', err)
      })
  },

  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
      reader.readAsDataURL(file)
    })
  },

  /**
   * 辨識字串中的超連結字段
   */
  processUrlString(inputText: string) {
    if (inputText) {
      const regxDNS =
        /((?:(h|H)(t|T){2}(p|P)(s)?:\/\/)?([\w-]+\.){1,3}[A-Za-z]+(:\d+)?(\/[~\w\/\.-]*)?(\?\S*)?(#\S*)?)+(\b)?\/?/gm // 比對非IP類網址
      const regxIP =
        /((?:(h|H)(t|T){2}(p|P)(s)?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/[~\w\/\.-]*)?(\?\S*)?(#\S*)?)+(\b)?\/?)/gm // 比對IP類網址
      let result = inputText + ' '

      const urlDNS = result.match(regxDNS) || []
      const urlIP = result.match(regxIP) || []
      const url = urlIP.concat(urlDNS)

      if (url.length > 0) {
        result = result.replace(regxDNS, `<a href="$1" target="_blank">$1</a>`)
        result = result.replace(regxIP, '<a href="$1" target="_blank">$1</a>')

        url.forEach(item => {
          if (item.indexOf('//') === -1) {
            result = result.replace('href="', 'href="//')
          }
        })
      }

      return result
    }
    return inputText
  },

  // 依據檔案副檔名 return 相對應的icon
  getFileIcon(fileName: string = '', fileType: string = '') {
    if (fileType === 'application/msword' || /\.docx?$/i.test(fileName)) {
      return file_word
    } else if (
      fileType === 'application/vnd.ms-powerpoint' ||
      /\.pptx?$/i.test(fileName)
    ) {
      return file_ppt
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      /\.xlsx?$/i.test(fileName)
    ) {
      return file_xls
    } else if (fileType === 'application/pdf' || /\.pdf$/i.test(fileName)) {
      return file_pdf
    } else if (
      /image/i.test(fileType) ||
      /\.jpe?g?$/i.test(fileName) ||
      /\.png?$/i.test(fileName) ||
      /\.bmp?$/i.test(fileName) ||
      /\.gif?$/i.test(fileName)
    ) {
      return file_img
    } else if (/\.mp4$/i.test(fileName)) {
      return file_vedio
    } else if (
      /\.ogg$/i.test(fileName) ||
      /\.flac$/i.test(fileName) ||
      /\.wav$/i.test(fileName) ||
      /\.mp3$/i.test(fileName)
    ) {
      return file_audio
    }

    return file_file
  },

  /**
   * 文件大小换算合适单位
   */
  getFileSize(fileByte: number) {
    let fileSizeByte = fileByte
    let fileSizeMsg = ''
    if (fileSizeByte < 1048576)
      fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + ' KB'
    else if (fileSizeByte == 1048576) fileSizeMsg = '1MB'
    else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
      fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + ' MB'
    else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
      fileSizeMsg = '1GB'
    else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
      fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    else fileSizeMsg = '文件超过1TB'
    return fileSizeMsg
  },

  /**
   * 转换可能带emoji表情的消息内容
   */
  convertEmojiContent(content: string) {
    if (content) {
      const regxExcludeIncompleteTag =
        /^((?!(<("[^"]*"|'[^']*'|[^'">])*>)).)*$/gm // 比對非完整tag
      const matchedString = content.match(regxExcludeIncompleteTag) || []

      matchedString.forEach(x => {
        const raw = x
        x = x.replace(/</g, '&lt;')
        content = content.replace(raw, x)
      })

      return content.replace(/\[([\w\W]{1,3})]/g, match => {
        const emoji = emojiList.find(item => item.emojiCode === match)
        return emoji
          ? `<img alt="${emoji['emojiCode']}" src="${emoji['emojiUrl']}" style="width:24px;vertical-align: middle;" />`
          : match
      })
    }

    return content
  },

  // 計算語音檔時間長度
  parseSecondToMinuteFormat(inputNumber: string) {
    if (inputNumber) {
      let result
      const timeNum = Number(inputNumber)

      if (timeNum > 60) {
        const minutes = parseInt(String(timeNum / 60))
        result =
          (minutes.toString().length < 2 ? '0' : '') +
          `${minutes}:${timeNum - minutes * 60}`
      } else {
        result = `00:${timeNum.toString().length < 2 ? '0' : ''}${timeNum}`
      }
      return result
    }
    return inputNumber
  },

  setRealRate(enName: string) {
    if (verifyTempStore.rateMapFromJson.length > 0) {
      const getEnRate = verifyTempStore.rateMapFromJson.find(
        _ => _.enName === enName
      )
      if (getEnRate) {
        return getEnRate.rate
      } else {
        return ''
      }
    } else {
      return ''
    }
  },

  deepCloneData(data: any) {
    return JSON.parse(JSON.stringify(data))
  },
  getRandomId() {
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
    const timeStamps = JSON.stringify(new Date().getTime())
    return randomString + timeStamps
  }
}
export default AppUtils
