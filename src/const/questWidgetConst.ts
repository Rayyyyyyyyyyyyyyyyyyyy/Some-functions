

	export const alignOption = [
		{
			"label": "置左",
			"value": 1
		},
		{
			"label": "置中",
			"value": 2
		}
	]
	export const sizeOption = [
		{
			"label": "特大",
			"value": 3
		},
		{
			"label": "大",
			"value": 2
		},
		{
			"label": "適中",
			"value": 1
		}
	]
	export const displayOption = [
		{
			"label": "隐藏",
			"value": 0
		},
		{
			"label": "于段落上方",
			"value": 1
		},
		{
			"label": "于段落下方",
			"value": 2
		},
		{
			"label": "于段落上与下",
			"value": 3
		},
		{
			"label": "于段落四周外框",
			"value": 4
		}
	]
	export const lineTypeOption = [
		{
			"label": "實線",
			"value": 1
		},
		{
			"label": "虛線",
			"value": 2
		}
	]
	export const picPositionOption = [
		{
			"label": "標題上方",
			"value": 1
		},
		{
			"label": "說明下方",
			"value": 2
		}
	]
	export const dateFormatOption = [
		{
			"label": "年-月-日",
			"value": "YYYY-MM-DD"
		},
		{
			"label": "年-月-日 時:分",
			"value": "YYYY-MM-DD HH:mm"
		}
	]
	export const textareaOption = [
		{
			"label": "自由输入",
			"value": "free"
		},
		{
			"label": "限输入数字",
			"value": "num"
		}
	]




export const partWidget = {
	"type": "part",
	"name": "段落",
	"partTitleAlign": 1,
	"partTitleSize": 1,
	"partTitleColor": "#000",
	"partDescAlign": 1,
	"partDescColor": "#000",
	"partLineDisplay": 0,
	"partLineType": 1,
	"partLineColor": "#ccc",
	"partPicPosition": 1,
	"partTitle": "",
	"partDesc": "",
	"partDescFileName": "",
	"partDescGroupName": "",
	"partDescFileId": "",
	"subjectList":[],
}

export const subjectWidget = [
	{
		"type": "1",
		"apiKey": "subType",
		"name": "選擇題",
		"optionMin": 1,
		"optionMax": 2,
		"options": [
			{
				"opType": 1,
				"opItem": "",
				"opFileName": "",
				"opGroupName": "",
				"opFileId": ""
			},
			{
				"opType": 1,
				"opItem": "",
				"opFileName": "",
				"opGroupName": "",
				"opFileId": ""
			},
		],
		"subIsRequire": false,
		"opIsSingle": false,
		"subTitle": "",
		"subDesc": "",
		"subDescFileName": "",
		"subDescGroupName": "",
		"subDescFileId": "",
		"shortAnsType": "",
		"dateFormatType": "",
	},
	{
		"type": "2",
		"apiKey": "subType",
		"name": "下拉題",
		"optionMin": 0,
		"optionMax": 0,
		"options": [
			{
				"opType": 1,
				"opItem": "",
				"opFileName": "",
				"opGroupName": "",
				"opFileId": ""
			},
		],
		"subTitle": "",
		"subDesc": "",
		"subDescFileName": "",
		"subDescGroupName": "",
		"subDescFileId": "",
		"subIsRequire": false,
		"opIsSingle": false,
		"shortAnsType": "",
		"dateFormatType": "",
	},
	{
		"type": "3",
		"apiKey": "subType",
		"name": "日期題",
		"optionMin": 0,
		"optionMax": 0,
		"options": [],

		"subTitle": "",
		"subDesc": "",
		"subDescFileName": "",
		"subDescGroupName": "",
		"subDescFileId": "",
		"subIsRequire": false,
		"opIsSingle": false,
		"shortAnsType": "",
		"dateFormatType": "年-月-日",
	},
	{
		"type": "4",
		"apiKey": "subType",
		"name": "評分題",
		"optionMin": 0,
		"optionMax": 0,
		"options": [],

		"subTitle": "",
		"subDesc": "",
		"subDescFileName": "",
		"subDescGroupName": "",
		"subDescFileId": "",
		"subIsRequire": false,
		"opIsSingle": false,
		"shortAnsType": "",
		"dateFormatType": "",
	},
	{
		"type": "5",
		"apiKey": "subType",
		"name": "簡答題",
		"optionMin": 0,
		"optionMax": 0,
		"options": [],

		"subTitle": "",
		"subDesc": "",
		"subDescFileName": "",
		"subDescGroupName": "",
		"subDescFileId": "",
		"subIsRequire": false,
		"opIsSingle": false,
		"shortAnsType": "free",
		"dateFormatType": "",
	}
]


