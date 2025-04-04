import { createServer, Model } from 'miragejs';

import { mockdatas } from './mockData'

export function mockServer() {
    return createServer({
        models: {
            employee: Model,
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
        },
    });
}