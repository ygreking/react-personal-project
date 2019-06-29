// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Spinner from '../../components/Spinner';
import Task from '../../components/Task';

export default class Scheduler extends Component {
    state = {
        tasks:          [],
        newTaskMessage: '',
        tasksFilter:    '',
        isTaskFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTaskFetchingState = (state) => {
        this.setState({
            isTaskFetching: state,
        });
    };

    _updateTasksFilter = () => {};

    _getAllCompleted = () => {};

    _fetchTasksAsync = async () => {
        this._setTaskFetchingState(true);

        try {
            const { data: tasks } = await api.fetchTasks({
                page:   1,
                size:   20,
                search: '',
            });

            this.setState({
                tasks,
                isTaskFetching: false,
            });
        } catch (error) {
            throw new Error(error);
        }
    };

    _createTaskAsync = async (message) => {
        this._setTaskFetchingState(true);

        try {
            const { data: task } = await api.createTask(message);

            this.setState(({ tasks }) => ({
                tasks:          [task, ...tasks],
                newTaskMessage: '',
                isTaskFetching: false,
            }));
        } catch (error) {
            throw new Error(error);
        }
    };

    _updateTaskAsync = async (task) => {
        this._setTaskFetchingState(true);

        try {
            const { data: updatedTask } = await api.updateTask([task]);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                ),
                isTaskFetching: false,
            }));
        } catch (error) {
            throw new Error(error);
        }
    };

    _removeTaskAsync = async (id) => {
        this._setTaskFetchingState(true);
        try {
            if (await api.removeTask(id)) {
                this.setState(({ tasks }) => ({
                    tasks:          tasks.filter((task) => task.id !== id),
                    isTaskFetching: false,
                }));
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _handleNewTaskKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this._createTaskAsync(this.state.newTaskMessage);
        } else if (event.key === 'Escape') {
            console.log('cancel new task');
        }
    };

    render () {
        const { tasks, isTaskFetching, newTaskMessage } = this.state;

        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTaskFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' />
                    </header>
                    <section>
                        <form>
                            <input
                                maxLength = '50'
                                placeholder = 'Описание новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                                onKeyPress = { this._handleNewTaskKeyPress }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{tasksJSX}</ul>
                        </div>
                    </section>
                    <footer>
                        <div />
                        <span className = { Styles.completeAllTasks } />
                    </footer>
                </main>
            </section>
        );
    }
}
