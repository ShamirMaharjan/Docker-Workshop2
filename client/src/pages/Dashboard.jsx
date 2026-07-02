import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';
import { useTasks } from '../hooks/useTasks';
import TaskModal from './TaskModal';

export default function Dashboard() {
    const { tasks, loading, addTask, updateStatus, deleteTask, editTask } = useTasks();
    
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        const success = await addTask(newTaskTitle, '', null, 'medium');
        if (success) setNewTaskTitle(''); // Clear input on success
    };

    const handleModalSave = async (title, desc, date, prio, editId) => {
        if (editId) {
            return await editTask(editId, title, desc, date, prio);
        } else {
            return await addTask(title, desc, date, prio);
        }
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.draggableId === source.droppableId) return;

        updateStatus(draggableId, destination.droppableId);
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center font-bold text-blue-600">Loading ToDo...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                editingTask={taskToEdit}
            />

            <main className="max-w-7xl mx-auto p-6 lg:p-8">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Your Workflow</h1>
                        <p className="text-gray-500 mt-1">Manage your priorities and focus for today.</p>
                    </div>

                    <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all text-sm bg-white"
                            />
                        </div>

                        <form onSubmit={handleQuickAdd} className="flex w-full sm:w-auto gap-2">
                            <input 
                                type="text" 
                                placeholder="What's on your mind?" 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            />
                            <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-sm transition-all whitespace-nowrap">
                                Stash
                            </button>
                        </form>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all w-full sm:w-auto justify-center"
                        >
                            <Plus className="h-5 w-5" /> New Task
                        </button>
                    </div>
                </div>

        
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60 flex flex-col">
                            <h2 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
                                Stashed
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {filteredTasks.filter(t => t.status === 'stashed').length}
                                </span>
                            </h2>
                            <Droppable droppableId="stashed">
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className={`flex-1 space-y-4 min-h-[200px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}
                                    >
                                        {filteredTasks.filter(t => t.status === 'stashed').map((task, index) => (
                                            <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}
                                                    >
                                                        <TaskCard task={task} onStatusChange={updateStatus} onDelete={deleteTask} onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col">
                            <h2 className="font-bold text-blue-800 mb-4 flex justify-between items-center">
                                Active
                                <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                    {filteredTasks.filter(t => t.status === 'active').length}
                                </span>
                            </h2>
                            <Droppable droppableId="active">
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className={`flex-1 space-y-4 min-h-[200px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-blue-100/50' : ''}`}
                                    >
                                        {filteredTasks.filter(t => t.status === 'active').map((task, index) => (
                                            <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}
                                                    >
                                                        <TaskCard task={task} onStatusChange={updateStatus} onDelete={deleteTask} onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-200/60 flex flex-col opacity-70 hover:opacity-100 transition-opacity">
                            <h2 className="font-bold text-gray-500 mb-4 flex justify-between items-center">
                                Cleared
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {filteredTasks.filter(t => t.status === 'cleared').length}
                                </span>
                            </h2>
                            <Droppable droppableId="cleared">
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className={`flex-1 space-y-4 min-h-[200px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}
                                    >
                                        {filteredTasks.filter(t => t.status === 'cleared').map((task, index) => (
                                            <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}
                                                    >
                                                        <TaskCard task={task} onStatusChange={updateStatus} onDelete={deleteTask} onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                    </div>
                </DragDropContext>
            </main>
        </div>
    );
}