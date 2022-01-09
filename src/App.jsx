import Buchungsseite from './Components/Buchungsseite'
import deLocale from 'date-fns/locale/de'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { deDE } from '@mui/material/locale'

const theme = createTheme(
  {
    palette: {
      primary: { main: '#183658' },
    },
  },
  deDE,
)

function App() {
  return (
    <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
      <Buchungsseite />
    </LocalizationProvider>
  </ThemeProvider>
  )
}

export default App
