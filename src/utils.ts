import { Employee } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(callback: T, delay = 100) => {
    let timeoutId: number | undefined = undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {callback(...args)}, delay)
    }
}

export type EmployeeTree = {
    data: Employee;
    subordinates: EmployeeTree[];
}

// const employeeIdMap = employees.reduce((acc, curr) => {
//     acc.set(curr.id, curr);
//     return acc;
// }, new Map<string, Employee>());
export const buildTree = (employeeIds: string[], employeeIdMap:  Map<string, Employee>):EmployeeTree[]  => {
   return employeeIds.reduce((acc, employee) => {
    const employeeData = employeeIdMap.get(employee);
    
    if(employeeData){
        const employeeRecord = {
            data: employeeData,
            subordinates: buildTree(employeeData.nextNodes, employeeIdMap)
        }
        acc.push(employeeRecord);
    }

    return acc;
   }, [] as EmployeeTree[])
}