import { ChakraProvider, Flex, Spinner, theme, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { produce } from 'immer';

import { mockServer } from './mockServer';
import { EmployeeDirectory } from './sections/EmployeeDirectory';

import { Employee } from './types';
import { buildTree, EmployeeTree } from './utils';
import { EmployeesTree } from './sections/Tree';


mockServer();


export const App = () => {
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  const mainManagerIdRef = useRef<string>('');
  const allEmployeesIdMapRef = useRef<Map<string, Employee>>(new Map());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeTree, setEmployeeTree] = useState<EmployeeTree[]>([]);

  const toast = useToast();

  const findTopLevelEmployees = (filteredEmployees: Employee[]): string[] => {
    const filteredIds = new Set(filteredEmployees.map(emp => emp.id));
    return filteredEmployees
      .filter(emp => !filteredIds.has(emp.managerId ?? ""))
      .map(emp => emp.id);
  }

  const onFilterEmployees = (filtered?: Employee[]) => {
    if (!filtered) {
      setEmployees(Array.from(allEmployeesIdMapRef.current.values()));
      const tree = buildTree([mainManagerIdRef.current], allEmployeesIdMapRef.current);
      setEmployeeTree(tree);
    } else {
      setEmployees(filtered);
      const rootIds = findTopLevelEmployees(filtered);
      const tree = buildTree(rootIds, allEmployeesIdMapRef.current);
      setEmployeeTree(tree);
    }
  }

  const handleUpdateManagerID = async (employeeIdToReassign: string, newManagerId: string) => {
    if (employeeIdToReassign === newManagerId) return;

    const employeeDataToReassign = allEmployeesIdMapRef.current.get(employeeIdToReassign);
    const newManagerData = allEmployeesIdMapRef.current.get(newManagerId);
    const olaManagerData = allEmployeesIdMapRef.current.get(employeeDataToReassign?.managerId ?? "");

    if (olaManagerData?.id === newManagerData?.id) return;

    const updatedEmployeeTree = produce(employeeTree, draft => {
      let draggedNode: EmployeeTree | undefined = undefined;

      // Filter dragged node from tree and keep an reference
      const removeNode = (nodes: EmployeeTree[]): EmployeeTree[] => {
        return nodes.filter(node => {
          if (node.data.id === employeeIdToReassign) {
            draggedNode = node;
            // Update managerId so new link is formed
            draggedNode.data.managerId = newManagerId;
            return false;
          }
          if (node.data.id === olaManagerData?.id) {
            node.data.nextNodes = node.data.nextNodes.filter((node) => node !== employeeIdToReassign);
          }
          node.subordinates = removeNode(node.subordinates);
          return true;
        });
      };

      const cleanedTree = removeNode(draft);

      const insertNode = (nodes: EmployeeTree[]) => {
        for (const node of nodes) {
          if (node.data.id === newManagerId) {
            node.subordinates.push(draggedNode!);
            node.data.nextNodes.push(employeeIdToReassign);
            return;
          }
          insertNode(node.subordinates);
        }
      };

      insertNode(cleanedTree);

      draft.length = 0;
      draft.push(...cleanedTree)
    });

    setEmployeeTree(updatedEmployeeTree);

    if (olaManagerData) {
      allEmployeesIdMapRef.current.set(olaManagerData.id, { ...olaManagerData, nextNodes: [...olaManagerData.nextNodes.filter((emp) => emp !== employeeIdToReassign)] } as Employee);
    }

    if (employeeDataToReassign) {
      allEmployeesIdMapRef.current.set(employeeIdToReassign, { ...employeeDataToReassign, managerId: newManagerId } as Employee);
    }

    if (newManagerData) {
      allEmployeesIdMapRef.current.set(newManagerId, { ...newManagerData, nextNodes: [...newManagerData.nextNodes, employeeIdToReassign] })
    }

    try {
      await fetch(`/api/employees/${employeeIdToReassign}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId: newManagerId }),
      });

      toast({
        title: 'Manager updated',
        description: `${employeeDataToReassign?.name} is now reporting to ${newManagerData?.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
    setFetchingEmployees(true)
    fetch('/api/employees')
      .then((res) => res.json())
      .then((res: { employees: Employee[] }) => {
        mainManagerIdRef.current = res.employees[0].id;
        setEmployees(res.employees);
        const employeeIdMap = res.employees.reduce((acc, curr) => {
          acc.set(curr.id, curr);
          return acc;
        }, new Map<string, Employee>());
        allEmployeesIdMapRef.current = employeeIdMap;
        const tree = buildTree([mainManagerIdRef.current], employeeIdMap);
        setEmployeeTree(tree);
      }
      ).catch(() => {
        setEmployees([]);
      }).finally(() => {
        setFetchingEmployees(false)
      });
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {
        fetchingEmployees ? (
          <>
            <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
              <Spinner />
            </Flex>
          </>
        ) : (
          <div className='app-container'>
            <EmployeeDirectory employees={employees} allEmployeesIdMapRef={allEmployeesIdMapRef} onFilterEmployees={onFilterEmployees} />
            <EmployeesTree employeeTree={employeeTree} allEmployeesIdMapRef={allEmployeesIdMapRef} handleUpdateManagerID={handleUpdateManagerID} />
          </div>
        )
      }
    </ChakraProvider >
  )
}
