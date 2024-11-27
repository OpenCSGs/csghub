/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/views/**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FFFFFF',
        'gray-25': '#FCFCFD',
        'gray-50': '#F9FAFB',
        'gray-100': '#F2F4F7',
        'gray-200': '#EAECF0',
        'gray-300': '#D0D5DD',
        'gray-400': '#98A2B3',
        'gray-500': '#667085',
        'gray-600': '#475467',
        'gray-700': '#344054',
        'gray-800': '#182230',
        'gray-900': '#101828',
        'gray-950': '#0C111D',  
        'brand-25': '#F0F3FF',
        'brand-50': '#CED8FF',
        'brand-100': '#ACBDFF',
        'brand-200': '#99AFFF',
        'brand-300': '#6584F8',
        'brand-400': '#5271E3',
        'brand-500': '#4D6AD6',
        'brand-600': '#3250BD',
        'brand-700': '#223B99',
        'brand-800': '#17308F',
        'brand-900': '#25367A',
        'brand-950': '#0E1B4E',
        'error-25': '#FFFBFA',
        'error-50': '#FEF3F2',
        'error-100': '#FEE4E2',
        'error-200': '#FECDCA',
        'error-300': '#FDA29B',
        'error-400': '#F97066',
        'error-500': '#F04438',
        'error-600': '#D92D20',
        'error-700': '#B42318',
        'error-800': '#912018',
        'error-900': '#7A271A',
        'error-950': '#55160C',
        'warning-25': '#FFFCF5',
        'warning-50': '#FFFAEB',
        'warning-100': '#FEF0C7',
        'warning-200': '#FEDF89',
        'warning-300': '#FEC84B',
        'warning-400': '#FDB022',
        'warning-500': '#F79009', 
        'warning-600': '#DC6803',
        'warning-700': '#B54708',
        'warning-800': '#93370D',
        'warning-900': '#7A2E0E',
        'warning-950': '#4E1D09',
        'success-25': '#F6FEF9',
        'success-50': '#ECFDF3',
        'success-100': '#DCFAE6',
        'success-200': '#ABEFC6',
        'success-300': '#75E0A7',
        'success-400': '#47CD89',
        'success-500': '#17B26A',
        'success-600': '#079455',
        'success-700': '#067647',
        'success-800': '#085D3A',
        'success-900': '#074D31',
        'success-950': '#053321',
      },
    },

    fontSize: {
      'xs': ['0.75rem', '1.125rem'],    // 12px, 18px
      'sm': ['0.875rem', '1.375rem'],   // 14px, 22px
      'md': ['1rem', '1.5rem'],         // 16px, 24px
      'lg': ['1.125rem', '1.75rem'],    // 18px, 28px
      'xl': ['1.25rem', '1.875rem'],    // 20px, 30px
      '2xl': ['1.5rem', '2rem'],        // 24px, 32px
      '3xl': ['1.875rem', '2.375rem'],  // 30px, 38px
      '4xl': ['2.25rem', '2.75rem'],    // 36px, 44px
      '5xl': ['3rem', '3.75rem'],       // 48px, 60px
      '6xl': ['3.75rem', '4.5rem'],     // 60px, 72px
      '7xl': ['4.5rem', '5.625rem'],    // 72px, 90px
    },

    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    borderRadius: {
      none: '0px',
      xxs: '2px',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '20px',
      '4xl': '24px',
      full: '9999px',
    },

    screens: {
      '2xl': {'max': '1536px'},
      'xl': {'max': '1280px'},
      'lg': {'max': '1024px'},
      'mlg': {'max': '826px'},
      'md': {'max': '768px'},
      'sm': {'max': '640px'},
    },
  },
  plugins: [],
}

