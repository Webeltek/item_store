
import UserProvider from './providers/UserProvider'
import { Button, ConfigProvider } from 'antd'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import Layout from './Layout'
import { Provider } from 'react-redux';
import store from "./redux/store"

function App() {
  
  const theme = createTheme({
      colors: {
        'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
      },
      fontFamily: 'Lato, sans-serif',
      defaultRadius: '0.3rem',
      components: {
        Button : {
          defaultProps: {
            color: "ocean-blue.5",
            // variant: 'gradient',
            //   gradient: { from: '#00a6fb', to: '#0582ca', deg: 135 },
          }
        }
      }
  })

  return (
    <MantineProvider theme={theme} >
      <ConfigProvider theme={ 
        {
          token: { 
            colorPrimary: '#0096c7',
            colorBgContainer: '#f9f9f9',
            borderRadius: "0.3rem",
          },
          components: {
            Button: {
              fontWeight: "bold"
            }
          }
        }
      }>
        <Provider store={store}>
          <UserProvider>
            <Layout />
          </UserProvider>
        </Provider>
      </ConfigProvider>
    </MantineProvider>
  )
}

export default App
