import './App.css';
import DisplayTable from './components/DisplayTable';
import { ChakraProvider } from '@chakra-ui/react';



function App() {
  return (
    <ChakraProvider>
    <div>
      <DisplayTable tournamentStageId={'4e50ba57-d5fe-4370-b2f8-e357ebeb4c83'}/>
    </div>
    </ChakraProvider>
  );
}

export default App;
