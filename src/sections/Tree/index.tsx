import { useState } from 'react'
import { Flex, Text, useToast } from '@chakra-ui/react'
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core'

import { EmployeeTree } from '../../utils'
import { TreeChart } from './TreeChart'

import { Employee } from '../../types'
import { EmployeeCard } from './EmployeeCard'


type EmployeeTreeProps = {
    employeeTree: EmployeeTree[];
    allEmployeesIdMapRef: React.RefObject<Map<string, Employee>>;
    handleUpdateManagerID: (employeeIdToMove: string, employeeIdManager: string) => void
}

export const EmployeesTree = ({ employeeTree, allEmployeesIdMapRef, handleUpdateManagerID }: EmployeeTreeProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const toast = useToast();

    const isDescendant = (draggedId: string, targetId: string, tree: EmployeeTree[]): boolean => {
        const findNode = (id: string, nodes: EmployeeTree[]): EmployeeTree | undefined => {
            for (const node of nodes) {
                if (node.data.id === id) return node;
                const found = findNode(id, node.subordinates);
                if (found) return found;
            }
            return undefined;
        };

        const checkDescendant = (node: EmployeeTree | undefined): boolean => {
            if (!node) return false;
            if (node.data.id === targetId) return true;
            return node.subordinates.some(sub => checkDescendant(sub));
        };

        const draggedNode = findNode(draggedId, tree);
        return checkDescendant(draggedNode);
    };

    return (
        employeeTree.length > 0 ? (
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={(event) => {
                    setActiveId(event.active.id as string);
                }}
                onDragEnd={(event) => {
                    setActiveId(null);
                    const { active, over } = event;

                    if (active.id !== over?.id && over?.id) {
                        const draggedId = active.id as string;
                        const dropTargetId = over.id as string;
                        if (isDescendant(draggedId, dropTargetId, employeeTree)) {
                            toast({
                                title: "Invalid move",
                                description: "You can't assign a manager under their own subordinate.",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                                position: "top-right",
                            });
                            return;
                        }
                        handleUpdateManagerID(draggedId, dropTargetId);
                    }
                }}
                onDragCancel={() => setActiveId(null)}
            >
                <div className='tree-wrapper'>
                    {
                        employeeTree.map((tree) => {
                            return (
                                <div
                                    className="tree-container"
                                    key={tree.data.id + "root"}
                                >
                                    <TreeChart employeeTree={[tree]} />
                                </div>
                            )
                        })
                    }
                </div>
                <DragOverlay>
                    {activeId ? (
                        <EmployeeCard employee={allEmployeesIdMapRef.current.get(activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        ) : (
            <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
                <Text fontSize="sm" color="gray.500">No employees found.</Text>
            </Flex>
        )

    )
}
