import { Employee } from "../types";

export const mockdatas: Employee[] = [
    {
        id: '1', name: 'Mark Hill', designation: 'Chief Executive Officer', team: 'Leadership'
    },
    {
        id: '2', name: 'Joe Linux', designation: 'Chief Technology Officer', team: 'Engineering', managerId: '1'
    },
    {
        id: '3', name: 'Linda May', designation: 'Chief Business Officer', team: 'Business', managerId: '1'
    },
    {
        id: '4', name: 'John Green', designation: 'Chief Accounting Officer', team: 'Accounts', managerId: '1'
    },
    {
        id: '5', name: 'Ron Blomquist', designation: 'Chief Information Security Officer', team: 'Engineering', managerId: '2'
    },
    {
        id: '6', name: "Michael Rubin", designation: 'Chief Innovation Officer', team: 'Engineering', managerId: '2'
    },
    {
        id: '7', name: "Alice Lopez", designation: 'Chief Communications Officer', team: 'Business', managerId: '3'
    },
    {
        id: '8', name: "Mary Johnson", designation: 'Chief Brand Officer', team: 'Business', managerId: '3'
    },
    {
        id: '9', name: "Kirik Douglas", designation: 'Chief Business Development Officer', team: 'Business', managerId: '3'
    },

]