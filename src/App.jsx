import { CssBaseline } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'
import { Themeify, Startup, ConfirmProvider, Provider, ErrorFallback } from '@medicorp'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {



    return (
        <div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ConfirmProvider>
                    <Themeify>
                        <Router>
                            <Provider>
                                <Startup />
                            </Provider>
                        </Router>
                        <CssBaseline />
                    </Themeify>
                </ConfirmProvider>
            </ErrorBoundary>
        </div>
    )
}

export default App
