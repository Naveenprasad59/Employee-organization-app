import { ChakraProvider, theme } from '@chakra-ui/react'

import { mockServer } from './mockServer';
import { EmployeeDirectory } from './sections/EmployeeDirectory';

mockServer();

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <div className='appContainer'>
        <EmployeeDirectory />
      </div>
    </ChakraProvider>
  )
}
