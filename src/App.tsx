import { ChakraProvider, theme } from '@chakra-ui/react'

import { mockServer } from './mockServer';
import { EmployeeDirectory } from './sections/EmployeeDirectory';
import { TreeChart } from './sections/Tree/TreeChart';
import { useEffect, useRef, useState } from 'react';
import { Employee } from './types';
import { buildTree, EmployeeTree } from './utils';

mockServer();

export const App = () => {

  const allEmployeesRef = useRef<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeTree, setEmployeeTree] = useState<EmployeeTree[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

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
        console.table(employeeIdMap);
        const tree = buildTree([allEmployeesRef.current[0].id], employeeIdMap);
        setEmployeeTree(tree);
      }
      ).catch(() => {
        setEmployees([]);
      }).finally(() => {
        setFetchingEmployees(false)
      });
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <div className='appContainer'>
        <EmployeeDirectory employees={employees} fetchingEmployees={fetchingEmployees} allEmployeesRef={allEmployeesRef} setEmployees={setEmployees} />
        <div
          className="tree-container"
        >
          <TreeChart employeeTree={employeeTree} />
        </div>
      </div>
    </ChakraProvider>
  )
}
