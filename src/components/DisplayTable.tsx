import React, { useState } from 'react';

import { useQuery, gql } from '@apollo/client';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, Text } from '@chakra-ui/react';
import { TableData, TeamStatistics } from '../types';
import DisplayTeamMatches from './DisplayTeamMatches';


const DisplayTable = ({tournamentStageId}: {tournamentStageId:string}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [teamId, setTeamId] = useState("")
  const [teamName, setTeamName] = useState("")

    const GET_TABLE = gql`
        query table($tournamentStageId: ID!) {
          tournamentStage(id: $tournamentStageId) {
            name
           standings(type: LEAGUE_TABLE) {
             participants {
                participant {
                  name
                  id
               }
              rank
              data {
               code
               value
        }
        }
        }
        }
        }
    `;

    const { loading, error, data } = useQuery(GET_TABLE, {
      variables: { tournamentStageId },
    });
    
    const tableData: TableData = data


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    //Function finds correct value related to the appropraite "code" (such as wins, defeits etc)
    const found = (name:string, data:TeamStatistics[]|undefined):String=>{
      const f = data && data.find(element => element.code===name)
      return f ? f.value : ""
      }

    //Calculates value for +/- column
    const findGoalDifference = (data:TeamStatistics[]|undefined):number => {
      const gf = data && data.find(element => element.code==="goalsfor")
      const ga = data && data.find(element => element.code==="goalsagainst")
      var gd = 0
      if (gf && ga){
        gd = parseInt(gf.value) - parseInt(ga.value) 
      }
      return gd
    }

    const handleModal = (id: string, name: string)  => {
      setTeamId(id)
      setTeamName(name)
      onOpen()
    }  

    return (
      <div>
        <Text align={'center'} fontSize='3xl' color={'gray.600'}> Eliteserien Tabell</Text>
        <TableContainer>
          <Table variant='striped' colorScheme='telegram'>
          <Thead>
            <Tr >
              <Th textAlign="center" isNumeric>Rank</Th>
              <Th textAlign="center">Lag</Th>
              <Th textAlign="center">Spilt</Th>
              <Th textAlign="center">Vunnet</Th>
              <Th textAlign="center" >Uavgjort</Th>
              <Th textAlign="center">Tap</Th>
              <Th textAlign="center">+</Th>
              <Th textAlign="center">-</Th>
              <Th textAlign="center">+/-</Th>
              <Th textAlign="center">Poeng</Th>
            </Tr>
          </Thead>
          <Tbody>
      {tableData.tournamentStage.standings && tableData.tournamentStage.standings[0].participants.map(({participant, rank, data}) => (
        <Tr textAlign="center" onClick={() => handleModal(participant.id, participant.name)} style={{cursor:'pointer'}} >
              <Td textAlign="center">{rank}</Td>
              <Td textAlign="center">{participant.name}</Td>
              <Td textAlign="center"> {found("played",data)}</Td>
              <Td textAlign="center"> {found("wins",data)}</Td>
              <Td textAlign="center"> {found("draws",data)}</Td>
              <Td textAlign="center"> {found("defeits",data)}</Td>
              <Td textAlign="center"> {found("goalsfor",data)}</Td>
              <Td textAlign="center"> {found("goalsagainst",data)}</Td>
              <Td textAlign="center"> {findGoalDifference(data)}</Td>
              <Td textAlign="center"> {found("points",data)}</Td>
          </Tr>

        )
        )}
          </Tbody>
          </Table>
        </TableContainer>
        {teamId !== "" && <DisplayTeamMatches isOpen={isOpen} onClose={onClose} participantId={teamId} teamName={teamName} />}
      </div>
    )

  ;
}
export default DisplayTable;