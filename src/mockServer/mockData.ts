import { Employee } from "../types";

export const mockdatas: Employee[] = [
  {
    id: '1', name: 'Mark Hill', designation: 'Chief Executive Officer', team: 'Leadership', nextNodes: ['2', '3', '4']
  },
  {
    id: '2', name: 'Joe Linux', designation: 'Chief Technology Officer', team: 'Engineering', managerId: '1', nextNodes: ['5', '6']
  },
  {
    id: '3', name: 'Linda May', designation: 'Chief Business Officer', team: 'Business', managerId: '1', nextNodes: ['7','8','9']
  },
  {
    id: '4', name: 'John Green', designation: 'Chief Accounting Officer', team: 'Accounts', managerId: '1', nextNodes: []
  },
  {
    id: '5', name: 'Ron Blomquist', designation: 'Chief Information Security Officer', team: 'Engineering', managerId: '2', nextNodes: []
  },
  {
    id: '6', name: "Michael Rubin", designation: 'Chief Innovation Officer', team: 'Engineering', managerId: '2', nextNodes: []
  },
  {
    id: '7', name: "Alice Lopez", designation: 'Chief Communications Officer', team: 'Business', managerId: '3', nextNodes: []
  },
  {
    id: '8', name: "Mary Johnson", designation: 'Chief Brand Officer', team: 'Business', managerId: '3', nextNodes: []
  },
  {
    id: '9', name: "Kirik Douglas", designation: 'Chief Business Development Officer', team: 'Business', managerId: '3', nextNodes: []
  },
];