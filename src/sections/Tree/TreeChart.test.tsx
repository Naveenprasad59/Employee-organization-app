import { render, screen } from '@testing-library/react';
import { TreeChart } from './TreeChart';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { EmployeeTree } from '../../utils';

const mockTree: EmployeeTree[] = [
    {
        data: {
            id: '1',
            name: 'Alice',
            designation: 'CEO',
            team: 'Leadership',
            nextNodes: ['2'],
        },
        subordinates: [
            {
                data: {
                    id: '2',
                    name: 'Bob',
                    designation: 'Manager',
                    team: 'Engineering',
                    nextNodes: ['3'],
                },
                subordinates: [
                    {
                        data: {
                            id: '3',
                            name: 'Charlie',
                            designation: 'Developer',
                            team: 'Engineering',
                            nextNodes: [],
                        },
                        subordinates: [],
                    },
                ],
            },
        ],
    },
];


describe('TreeChart', () => {
    it('should render employee tree correctly', () => {
        render(<TreeChart employeeTree={mockTree} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('CEO')).toBeInTheDocument();
        expect(screen.getByText('Leadership')).toBeInTheDocument();
    });

    it('should render nested subordinates correctly', () => {
        render(<TreeChart employeeTree={mockTree} />);

        // Top level
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('CEO')).toBeInTheDocument();

        // 1st level subordinate
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();

        // 2nd level subordinate
        expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
    });
});
