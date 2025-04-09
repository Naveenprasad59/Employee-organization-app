import { Box, Text, Heading } from "@chakra-ui/react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { Employee } from "../../types";


interface EmployeeCardProps {
    employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: employee.id,
        data: employee,
    });

    const { attributes, listeners, setNodeRef: setDragRef, transform } = useDraggable({
        id: employee.id,
        data: employee,
    });

    return (
        <Box display="inline-flex"
            w="160px"
            h="110px"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300" ref={setDropRef} bg="gray.50" boxShadow="sm" _hover={{ boxShadow: "md", bg: "gray.100" }}>
            <Box
                ref={setDragRef}
                display="inline-flex"
                w="160px"
                h="110px"
                flexDir="column"
                justifyContent="center"
                p={3}
                style={{
                    transform: transform
                        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                        : undefined,
                    touchAction: 'none',
                    cursor: 'grab',
                    border: isOver ? '2px dashed #3182ce' : 'none',
                    borderRadius: '8px',
                    padding: '4px',
                    transition: 'border 0.2s ease',
                }}
                {...listeners}
                {...attributes}
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
        </Box>

    );
};
