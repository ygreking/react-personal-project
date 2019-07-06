import { MAIN_URL, TOKEN } from './config';

import { encodeQueryString } from '../instruments/';

export const api = {
    // async fetchTasks () {
    //     const e = await fetch(MAIN_URL, {
    //         method:  'GET',
    //         headers: {
    //             Authorization: TOKEN,
    //         },
    //     });

    //     const { data: t } = await e.json();

    //     if (e.status !== 200) {
    //         throw new Error('Tasks were not fetched');
    //     }

    //     return t;
    // },
    fetchTasks: async (
        params = {
            page:   1,
            size:   10,
            search: '',
        }
    ) => {
        const url = `${MAIN_URL}${encodeQueryString(params)}`;

        const response = await fetch(url, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });
        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message);
        }

        return data.data;
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

        if (response.status !== 200) {
            throw new Error(data.message);
        }

        return data.data;
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

        if (response.status !== 200) {
            throw new Error(data.message);
        }

        return data.data;
    },
    removeTask: async (id) => {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            const data = await response.json();

            throw new Error(data.message);
        }
    },
    completeAllTasks: async (tasks) => {
        const updateQueue = [];

        for (const task of tasks) {
            updateQueue.push(
                fetch(MAIN_URL, {
                    method:  'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  TOKEN,
                    },
                    body: JSON.stringify([{ ...task, ...{ completed: true }}]),
                })
            );
        }
        const result = await Promise.all(updateQueue);

        if (
            !result.every((response) => {
                return response.status === 200;
            })
        ) {
            throw new Error(`Couldn't complete all tasks`);
        }
    },
};
