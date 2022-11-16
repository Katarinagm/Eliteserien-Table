import { useQuery, gql } from '@apollo/client';
import { TeamMatchesData } from '../types';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';


interface DisplayTeamMatchesProps{
  isOpen:boolean;
  onClose: () => void;
  participantId:string;
  teamName: string;
}

const DisplayTeamMatches = ({isOpen, onClose, participantId, teamName}: DisplayTeamMatchesProps) => {
    const GET_TEAM_MATCHES = gql`
        query teamMatches($participantId: ID!, $fromDate: LocalDate!,
            $toDate: LocalDate!) {
            eventsByParticipantAndDateRange(participantId: $participantId, fromDate: $fromDate, toDate: $toDate) {
            startDate
            incidents {
                score
              }
            tournamentStage {
            name
            }
            participants {
                participant {
                    name
                    id
            }
            }
            }
            }
    `;

    const { loading, error, data } = useQuery(GET_TEAM_MATCHES, {
      variables: { participantId, fromDate: "2022-04-02",
      toDate: "2022-11-13" },
    });
    
    //Only display matches related to Eliteserien
    const teamMatchesData: TeamMatchesData = data
    const filtered = teamMatchesData && teamMatchesData.eventsByParticipantAndDateRange.filter(element => element.tournamentStage.name === 'Eliteserien')

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
      <div>
        <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{teamName} resultater</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <TableContainer>
          <Table variant='striped' colorScheme='telegram'>
          <Thead>
            <Tr>
              <Th>Lag</Th>
              <Th>Resultat</Th>
              <Th>Motstander</Th>
            </Tr>
          </Thead>
          <Tbody>
          {filtered.reverse().map(({ incidents, participants}) => (
        <Tr>
              <Td>{participants[0].participant.name}</Td>
              <Td>{incidents[0].score}</Td>
              <Td>{participants[1].participant.name}</Td>
          </Tr>

        )
        )}
          </Tbody>
          </Table>
        </TableContainer>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='telegram' mr={3} onClick={onClose}>
              Lukk
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        
    </div>
    )

  ;
}
export default DisplayTeamMatches;