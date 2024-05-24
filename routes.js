import {randomUUID} from 'node:crypto';
import {Database} from './src/database.js';

import { buildRoutePath } from './src/utils/build-routh-path.js';


const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) =>{

            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },

    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {
            const {title, description} = req.body;

            const task = {

                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end();
        }
    },

    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {title, description} = req.body;
            const {id} = req.params

            database.update('tasks', id, {
                title,
                description, 
            })

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {completed_at } = req.body;
            const {id} = req.params

            database.update('tasks', id, {
                completed_at
            })

            return res.writeHead(204).end();
        }
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', {id})

            if(!task){
                return res.end(JSON.stringify("task não existe"))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end();
        }
    },
    
]

