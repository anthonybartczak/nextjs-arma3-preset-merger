'use client'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import createTheme from '@mui/material/styles/createTheme'

const theme = createTheme({
    typography: {
        fontFamily: 'inherit',
    }
});


const NextThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default NextThemeProvider