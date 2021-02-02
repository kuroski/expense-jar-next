import { extendTheme } from '@chakra-ui/react'
import type { ThemeOverride } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme: ThemeOverride = extendTheme({ config })
export default theme
