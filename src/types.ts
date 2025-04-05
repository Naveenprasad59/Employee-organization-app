export interface Employee {
  id: string;
  name: string;
  designation: string;
  team: Team;
  managerId?: string;
}

export const teams = ['Leadership', 'Engineering', 'Business', 'Accounts'] as const;
export type Team = typeof teams[number];

