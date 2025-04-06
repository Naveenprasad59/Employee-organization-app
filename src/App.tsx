import { ChakraProvider, theme } from '@chakra-ui/react'

import { mockServer } from './mockServer';
import { EmployeeDirectory } from './sections/EmployeeDirectory';
import { TreeChart } from './sections/Tree/TreeChart';
import { useEffect, useRef, useState } from 'react';
import { Employee } from './types';
import { buildTree, EmployeeTree } from './utils';

mockServer();

export const App = () => {

  // TODO: fix the duplication of employee values
  const allEmployeesRef = useRef<Employee[]>([]);
  const allEmployeesIdMapRef = useRef<Map<string, Employee>>(new Map());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeTree, setEmployeeTree] = useState<EmployeeTree[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);


  function findTopLevelEmployees(filteredEmployees: Employee[]): string[] {
    const filteredIds = new Set(filteredEmployees.map(emp => emp.id));
    return filteredEmployees
      .filter(emp => !filteredIds.has(emp.managerId ?? ""))
      .map(emp => emp.id);
  }


  const onFilterEmployees = (filtered?: Employee[]) => {
    if (!filtered) {
      setEmployees(allEmployeesRef.current);
      const tree = buildTree([allEmployeesRef.current[0].id], allEmployeesIdMapRef.current);
      setEmployeeTree(tree);
    } else {
      setEmployees(filtered);
      const rootIds = findTopLevelEmployees(filtered);
      const tree = buildTree(rootIds, allEmployeesIdMapRef.current);
      setEmployeeTree(tree);
    }

  }

  useEffect(() => {
    setFetchingEmployees(true)
    fetch('/api/employees')
      .then((res) => res.json())
      .then((res) => {
        allEmployeesRef.current = res.employees;
        setEmployees(res.employees);
        console.table(res.employees);
        const employeeIdMap = allEmployeesRef.current.reduce((acc, curr) => {
          acc.set(curr.id, curr);
          return acc;
        }, new Map<string, Employee>());
        allEmployeesIdMapRef.current = employeeIdMap;
        console.table(employeeIdMap);
        const tree = buildTree([allEmployeesRef.current[0].id], employeeIdMap);
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
      <div className='app-container'>
        <EmployeeDirectory employees={employees} fetchingEmployees={fetchingEmployees} allEmployeesRef={allEmployeesRef} onFilterEmployees={onFilterEmployees} />
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
      </div>
    </ChakraProvider>
  )
}
