import { useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
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
                        handleUpdateManagerID(active.id as string, over.id as string);
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
