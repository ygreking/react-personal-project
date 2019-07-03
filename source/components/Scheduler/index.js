// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Checkbox from '../../theme/assets/Checkbox';
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

    _createTaskAsync = async (event) => {
        event.preventDefault();
        this._setTaskFetchingState(true);

        try {
            const { data: task } = await api.createTask(
                this.state.newTaskMessage
            );

            this.setState(({ tasks }) => ({
                tasks:          [task, ...tasks],
                newTaskMessage: '',
                isTaskFetching: false,
            }));
        } catch (error) {
            throw new Error(error);
        }
    };

    _updateTaskAsync = async (taskUpdateData) => {
        this._setTaskFetchingState(true);

        try {
            let { data: updatedTask } = await api.updateTask(taskUpdateData);

            updatedTask = Array.isArray(updatedTask)
                ? updatedTask[0]
                : updatedTask;

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
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описание новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{tasksJSX}</ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#ffffff'
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
