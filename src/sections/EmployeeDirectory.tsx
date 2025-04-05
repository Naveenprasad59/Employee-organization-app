import { JSX } from "react"
import { produce } from "immer";
import { Box, Flex, Heading, Input, Select, Text, Divider, Spinner } from "@chakra-ui/react";

import { Employee, Team, teams } from "../types";
import { debounce } from "../utils";

type EmployeeDirectoryProps = {
  employees: Employee[];
  fetchingEmployees: boolean;
  allEmployeesRef: React.RefObject<Employee[]>;
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
}

export const EmployeeDirectory = ({ employees, fetchingEmployees, allEmployeesRef, setEmployees }: EmployeeDirectoryProps): JSX.Element => {

  const handleUpdateSearchText = (val: string) => {
    if (val.length === 0) {
      setEmployees(allEmployeesRef.current);
      return;
    }

    const updatedEmployees = produce(allEmployeesRef.current, (draftEmployees) => {
      const regex = new RegExp(val.trim(), 'i');
      return draftEmployees.filter((emp) => regex.test(emp.name));
    });

    setEmployees(updatedEmployees);
  }

  const debouncedSearchTextHandler = debounce(handleUpdateSearchText, 500);

  const handleTeamFilterUpdate = (selectedFilter: string) => {
    if (selectedFilter.length === 0) {
      setEmployees(allEmployeesRef.current);
      return;
    }
    const updatedEmployees = produce(allEmployeesRef.current, (draftEmployees) => {
      return draftEmployees.filter((emp) => {
        return emp.team === selectedFilter as Team
      });
    });

    setEmployees(updatedEmployees);
  }



  return (
    <Box as="aside" h="100%" w="100%" p="20px" borderRight="1px solid"
      borderColor="gray.200">
      {
        fetchingEmployees ? (
          <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : <>
          <Flex gap="4px" pb={4} zIndex={1}>
            <Input
              placeholder="Search employees..."
              size="sm"
              borderRadius="4px"
              onChange={(e) => debouncedSearchTextHandler(e.target.value)}
            />
            <Select
              placeholder="All Teams"
              size="sm"
              borderRadius="4px"
              onChange={(e) => handleTeamFilterUpdate(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </Select>
          </Flex>


          <Flex direction="column" align="start" gap={4} overflow="auto">
            {employees.length === 0 ? <Text fontSize="sm" color="gray.500">No employees found.</Text> : employees.map((emp) => (
              <Box key={emp.id} w="100%">
                <Heading as="h4" size="sm">{emp.name}</Heading>
                <Text fontSize="sm">{emp.designation} - {emp.team}</Text>
                <Divider my={2} />
              </Box>
            ))}
          </Flex>
        </>
      }

    </Box>
  )
}
