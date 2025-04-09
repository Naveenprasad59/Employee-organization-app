import { createServer, Model, Response } from 'miragejs';

import { mockdatas } from './mockData'
import { Employee } from '../types';

export function mockServer() {
    return createServer({
        models: {
            employee: Model.extend<Partial<Employee>>({}),
        },

        seeds(server) {
            mockdatas.forEach((mockData) => {
                server.create('employee', mockData);
            });
        },

        routes() {
            this.get('/api/employees', (schema) => {
                return schema.all("employee");
            });

            this.patch('/api/employees/:id', (schema, request) => {
                const id = request.params.id;
                const { managerId } = JSON.parse(request.requestBody);

                const employee = schema.find('employee', id);
                if (!employee) return new Response(
                    404,
                    { 'Content-Type': 'application/json' },
                    { error: 'Employee not found' }
                  )

                const employeeAttrs = employee.attrs as Employee;

                const oldManagerId = employeeAttrs.managerId;

                // ✅ Update dragged employee's managerId
                employee.update({ managerId });

                // ✅ Remove from old manager's nextNodes
                if (oldManagerId && oldManagerId !== managerId) {
                    const oldManager = schema.find('employee', oldManagerId);
                    if (oldManager) {
                        const oldManagerAttrs = oldManager.attrs as Employee;
                        const updatedNext = (oldManagerAttrs.nextNodes || []).filter(
                            (eid) => eid !== id
                        );
                        oldManager.update({ nextNodes: updatedNext });
                    }
                }

                // ✅ Add to new manager's nextNodes
                const newManager = schema.find('employee', managerId);
                if (newManager) {
                    const newManagerAttrs = newManager.attrs as Employee;
                    const currentNext = newManagerAttrs.nextNodes || [];
                    if (!currentNext.includes(id)) {
                        newManager.update({ nextNodes: [...currentNext, id] });
                    }
                }

                return employee;
            });

        },
    });
}