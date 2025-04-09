import { JSX, useState } from "react";
import { produce } from "immer";
import { Box, Flex, Heading, Input, Select, Text, Divider, Button } from "@chakra-ui/react";

import { Employee, Team, teams } from "../types";

type EmployeeDirectoryProps = {
  employees: Employee[];
  allEmployeesIdMapRef: React.RefObject<Map<string, Employee>>;
  onFilterEmployees: (filtered?: Employee[]) => void;
}

export const EmployeeDirectory = ({ employees, allEmployeesIdMapRef, onFilterEmployees }: EmployeeDirectoryProps): JSX.Element => {

  const [searchText, setSearchText] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | 'All Teams'>('All Teams');

  const applyFilters = () => {
    const employees = Array.from(allEmployeesIdMapRef.current.values());
    const updatedEmployes = produce(employees, (employeesDraft) => {
      const regex = new RegExp(searchText.trim(), "i");
      return employeesDraft.filter((emp) => {
        const matchesSearch =
          regex.test(emp.name) ||
          regex.test(emp.designation);
        const matchesTeam = selectedTeam === 'All Teams' || emp.team === selectedTeam;
        return matchesSearch && matchesTeam;
      })
    });

    onFilterEmployees(updatedEmployes);
  };

  const resetFilters = () => {
    onFilterEmployees();
    setSearchText("");
    setSelectedTeam("All Teams")
  };

  return (
    <Box as="aside" h="100%" w="100%" p="20px" borderRight="1px solid"
      borderColor="gray.200">
      {
        <>
          <Flex flexDir="column">
            <Flex gap="4px" pb={4} zIndex={1}>
              <Input
                placeholder="Search employees..."
                size="sm"
                borderRadius="4px"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                placeholder="All Teams"
                size="sm"
                borderRadius="4px"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value.length ? e.target.value as Team : 'All Teams')}
              >
                {teams.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </Select>
            </Flex>
            <Flex gap="4px" pb={4} zIndex={1}>
              <Button size="sm" colorScheme="blue" onClick={applyFilters}>
                Filter
              </Button>
              <Button size="sm" onClick={resetFilters}>
                Clear
              </Button>
            </Flex>
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
