import { MAIN_URL, TOKEN } from './config';

import { encodeQueryString } from '../instruments/';

export const api = {
    fetchTasks: async (params) => {
        const url = `${MAIN_URL}${encodeQueryString(params)}`;

        const response = await fetch(url, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    },
    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    },
    updateTask: async (taskUpdateData) => {
        const body = Array.isArray(taskUpdateData)
            ? taskUpdateData
            : [taskUpdateData];

        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    },
    removeTask: async (id) => {
        const url = `${MAIN_URL}/${id}`;
        const response = await fetch(url, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (!response.ok) {
            const data = await response.json();

            throw new Error(data.message);
        } else {
            return true;
        }
    },
    completeAllTasks: () => {},
};
