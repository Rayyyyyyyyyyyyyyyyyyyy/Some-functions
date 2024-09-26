module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#409eff',
          light: '#adcdee',
          dark: '#3560f0'
        },
        secondary: {
          DEFAULT: '#E9EDF0',
          light: '#F6F6F6',
          dark: '#707070'
        },
        success: {
          DEFAULT: '#8FC69A',
          light: '#52c41a'
        },
        hr: '#ebedf0',
        red: {
          DEFAULT: '#ff0000'
        },
        bg: {
          DEFAULT: '#f3eeee',
          light: '#f0f0f0',
        },
        text: {
          DEFAULT: '#000',
          light: '#e0e4ef'
        },
        warning: {
          DEFAULT: '#e2ab00',
          dark: '#FFB96F',
          light: '#FFF3CC'
        }
      },
    }
  }
}
