import { Box, Text, Heading } from "@chakra-ui/react";
import { Employee } from "../../types";


interface EmployeeCardProps {
    employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
    return (
        <Box
            display="inline-flex"
            flexDir="column"
            justifyContent="center"
            w="160px"
            h="110px"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            bg="gray.50"
            boxShadow="sm"
            _hover={{ boxShadow: "md", bg: "gray.100" }}
        >
            <Heading as="h4" textAlign="start" size="sm" noOfLines={1}>
                {employee.name}
            </Heading>
            <Text fontSize="xs" textAlign="start" color="gray.600">
                {employee.designation}
            </Text>
            <Text fontSize="xs" textAlign="start" color="blue.500">
                {employee.team}
            </Text>
        </Box>
    );
};
