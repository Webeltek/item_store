import UserProvider from './providers/UserProvider'
import { Button, ConfigProvider } from 'antd'
import '@mantine/core/styles.css';
import { MantineProvider, PasswordInput, TextInput, createTheme } from '@mantine/core';
import { createClient, Provider as UrqlProvider, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import Layout from './Layout'
import { Provider } from 'react-redux';
import store from "./redux/store";
import classes from './App.module.css';

const client = createClient({
  url: `${import.meta.env.VITE_API_URL}/graphql`,
  fetchOptions: () => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    return {
      headers: { 
        "X-Authorization": token ? `${token}` : '',
      },
    };
  },
  exchanges: [dedupExchange, cacheExchange, fetchExchange]
});

function App() {
  
  const theme = createTheme({
      colors: {
        'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
      },
      fontFamily: 'Lato, sans-serif',
      defaultRadius: '0.5rem',
      components: {
        Button : {
          defaultProps: {
            color: "ocean-blue.5",
            radius: '5rem',
            // variant: 'gradient',
            //   gradient: { from: '#00a6fb', to: '#0582ca', deg: 135 },
          }
        },
        TextInput : TextInput.extend({
          classNames: {
            input: classes.input,
            label: classes.label,
          }
        }),
        PasswordInput : PasswordInput.extend({
          classNames: {
            input: classes.input,
            label: classes.label,
          },
          // vars:(theme,props)=> { 
          //   return {
          //     input: {
          //       '--input-bd-focus': 'var(--mantine-color-ocean-blue-6)',
          //     }
          //   }
          // }
        })
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
            <UrqlProvider value={client}>
              <Layout />
            </UrqlProvider>
          </UserProvider>
        </Provider>
      </ConfigProvider>
    </MantineProvider>
   )
}

export default App
