
import UserProvider from './providers/UserProvider'
import { Button, ConfigProvider } from 'antd'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Layout from './Layout'

function App() {
  

  return (
    <MantineProvider theme={ {
      fontFamily: 'Lato, sans-serif',
      defaultRadius: '0.3rem',
      components: {
        Button : {
          defaultProps: {
            color: "teal",
            variant: 'gradient',
              gradient: { from: '#00a6fb', to: '#0582ca', deg: 135 },
          }
        }
      }
      }}>
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
        <UserProvider>
          
          <Layout />
        </UserProvider>
      </ConfigProvider>
    </MantineProvider>
  )
}

export default App
