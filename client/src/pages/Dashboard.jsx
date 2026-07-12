import { useState, useRef, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';
import { useTasks } from '../hooks/useTasks';
import TaskModal from './TaskModal';
import DashboardSkeleton from '../components/skelton/Dashboard';
import Companion from '../components/Companion';

export default function Dashboard() {
    const { tasks, loading, addTask, updateStatus, deleteTask, editTask } = useTasks();
    
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(0); 
    const scrollContainerRef = useRef(null);

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        const success = await addTask(newTaskTitle, '', null, 'medium');
        if (success) setNewTaskTitle(''); 
    };

    const handleModalSave = async (title, desc, date, prio, editId) => {
        if (editId) return await editTask(editId, title, desc, date, prio);
        else return await addTask(title, desc, date, prio);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;
        updateStatus(draggableId, destination.droppableId);
    };

    // calculate mobile scrolling to update the top tabs
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const currentIndex = Math.round(scrollPosition / containerWidth);
        setActiveTab(currentIndex);
    };

    // click a tab to scroll the view
    const scrollToTab = (index) => {
        if (!scrollContainerRef.current) return;
        const containerWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({ left: index * containerWidth, behavior: 'smooth' });
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const mobileTabs = [
        { label: 'Later', value: 'stashed' },
        { label: 'Today', value: 'active' },
        { label: 'Done', value: 'cleared' },
    ]

    useEffect(() => {
        const hasActive = tasks.some(t => t.status === 'active');
        const hasStashed = tasks.some(t => t.status === 'stashed');

        if (scrollContainerRef.current) {
            if (hasActive) {
                scrollToTab(1);
            } else if (hasStashed) {
                scrollToTab(0);
            }
        };
    }, [tasks]);

    if (loading) return <div><DashboardSkeleton /></div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
            <Navbar />
            <TaskModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }} onSave={handleModalSave} editingTask={taskToEdit} />

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col h-[calc(100vh-70px)] md:h-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <Companion tasks={tasks} size="small" />
                    
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Your Workflow</h1>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">Manage your priorities and focus for today.</p>
                        </div>
                    </div>

                    <div className="flex w-full md:w-auto gap-3 flex-col sm:flex-row">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all text-sm bg-white"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleQuickAdd} className="flex w-full sm:w-auto gap-2 hidden sm:flex">
                            <input type="text" placeholder="Quick stash..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all text-sm"/>
                            <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center shadow-sm transition-all whitespace-nowrap">Stash</button>
                        </form>

                        <button onClick={() => setIsModalOpen(true)} className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold items-center gap-2 shadow-sm transition-all whitespace-nowrap">
                            <Plus className="h-5 w-5" /> New Task
                        </button>
                    </div>
                </div>

                {/*search hub*/}
                {searchQuery ? (
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 overflow-y-auto">
                        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Search Results 
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{filteredTasks.length}</span>
                        </h2>
                        {filteredTasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTasks.map(task => (
                                    <TaskCard key={task._id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-12 font-medium">No tasks found matching "{searchQuery}"</div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0">
                        
                        {/*mobile navigation tabs*/}
                        <div className="md:hidden flex gap-2 mb-4 bg-gray-200/50 p-1 rounded-xl shrink-0">
                            {mobileTabs.map((tab, idx) => (
                                <button 
                                    key={tab.value}
                                    onClick={() => scrollToTab(idx)}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === idx ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                >
                                    {tab.label} ({tasks.filter(t => t.status === tab.value).length})
                                </button>
                            ))}
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <div 
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 h-full"
                            >
                                {/*column 1 stashed*/}
                                <div className="w-[calc(100vw-32px)] sm:w-[350px] md:w-auto shrink-0 snap-center bg-gray-100/50 p-3 sm:p-4 rounded-2xl border border-gray-200/60 flex flex-col h-full overflow-hidden">
                                    <h2 className="hidden md:flex font-bold text-gray-700 mb-4 justify-between items-center">
                                        Later <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{filteredTasks.filter(t => t.status === 'stashed').length}</span>
                                    </h2>
                                    <Droppable droppableId="stashed">
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 space-y-3 sm:space-y-4 overflow-y-auto min-h-[100px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}>
                                                {filteredTasks.filter(t => t.status === 'stashed').map((task, index) => (
                                                    <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}>
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

                                {/*column 2 active*/}
                                <div className="w-[calc(100vw-32px)] sm:w-[350px] md:w-auto shrink-0 snap-center bg-blue-50/50 p-3 sm:p-4 rounded-2xl border border-blue-100 flex flex-col h-full overflow-hidden">
                                    <h2 className="hidden md:flex font-bold text-blue-800 mb-4 justify-between items-center">
                                        Today <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{filteredTasks.filter(t => t.status === 'active').length}</span>
                                    </h2>
                                    <Droppable droppableId="active">
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 space-y-3 sm:space-y-4 overflow-y-auto min-h-[100px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-blue-100/50' : ''}`}>
                                                {filteredTasks.filter(t => t.status === 'active').map((task, index) => (
                                                    <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}>
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

                                {/* Column 3 cleared */}
                                <div className="w-[calc(100vw-32px)] sm:w-[350px] md:w-auto shrink-0 snap-center bg-gray-100/50 p-3 sm:p-4 rounded-2xl border border-gray-200/60 flex flex-col h-full overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                                    <h2 className="hidden md:flex font-bold text-gray-500 mb-4 justify-between items-center">
                                        Done <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{filteredTasks.filter(t => t.status === 'cleared').length}</span>
                                    </h2>
                                    <Droppable droppableId="cleared">
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 space-y-3 sm:space-y-4 overflow-y-auto min-h-[100px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}>
                                                {filteredTasks.filter(t => t.status === 'cleared').map((task, index) => (
                                                    <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={snapshot.isDragging ? 'opacity-80 rotate-2 scale-105 transition-transform' : ''}>
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
                    </div>
                )}
            </main>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-8 right-6 h-14 w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center z-40 transition-transform active:scale-95"
            >
                <Plus className="h-8 w-8" />
            </button>
        </div>
    );
}