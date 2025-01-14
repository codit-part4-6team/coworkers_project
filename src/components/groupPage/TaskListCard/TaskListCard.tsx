import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/Modal';
import TaskItem from '@/components/groupPage/TaskListCard/TaskItem';
import useModalStore from '@/store/modalStore';
import {
  useTaskListsQuery,
  useCreateTaskListMutation,
  useEditTaskListDetailMutation,
  useOrderTaskListDetailMutation,
} from '@/lib/taskListApi';
import XIcon from '@/assets/x_icon.svg';
import { TaskList } from '@/types/taskTypes';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '@/components/taskListsPage/StrictModeDroppable';

const TaskListCard = ({ groupId }: { groupId: number }) => {
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editingListName, setEditingListName] = useState('');
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useTaskListsQuery(groupId);

  const createTaskListMutation = useCreateTaskListMutation();
  const editTaskListMutation = useEditTaskListDetailMutation(
    groupId,
    editingListId || 0,
    editingListName,
  );

  const orderTaskListMutation = useOrderTaskListDetailMutation();
  
  useEffect(() => {
    if (groupData?.data?.taskLists) {
      setTaskLists(groupData.data.taskLists);
    }
  }, [groupData]);

  const handleOpenModal = (modalId: string) => {
    openModal(modalId);
  };

  const handleCloseModal = (modalId: string) => {
    closeModal(modalId);
    if (modalId === 'newTaskList') {
      setNewListName('');
    } else if (modalId === 'editTaskList') {
      setEditingListId(null);
      setEditingListName('');
    }
  };

  const handleCreateList = async () => {
    if (newListName.trim()) {
      try {
        await createTaskListMutation.mutateAsync({
          groupId,
          name: newListName,
        });
        queryClient.invalidateQueries({ queryKey: ['taskLists', groupId] });
        refetch();
        setNewListName('');
        handleCloseModal('newTaskList');
      } catch (error) {
        console.error('Failed to create new task list:', error);
      }
    }
  };

  const handleEditList = async () => {
    if (editingListName.trim() && editingListId) {
      try {
        await editTaskListMutation.mutateAsync();
        queryClient.invalidateQueries({ queryKey: ['taskLists', groupId] });
        refetch();
        handleCloseModal('editTaskList');
      } catch (error) {
        console.error('Failed to edit task list:', error);
      }
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingListId(id);
    setEditingListName(name);
    handleOpenModal('editTaskList');
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (sourceIndex !== destinationIndex) {
      const taskListId = Number(draggableId);
      const newTaskLists = Array.from(taskLists);
      const [reorderedItem] = newTaskLists.splice(sourceIndex, 1);
      newTaskLists.splice(destinationIndex, 0, reorderedItem);

      setTaskLists(newTaskLists);

      orderTaskListMutation.mutate(
        {
          groupId,
          taskListId,
          displayIndex: destinationIndex,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['taskLists', groupId] });
          },
          onError: (error) => {
            console.error('Error updating order:', error);
            setTaskLists(taskLists);
          },
        },
      );
    }
  };


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading task lists</div>;

  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          할 일 목록
          <span className="text-text-default font-regular ml-2">
            ({taskLists.length}개)
          </span>
        </h2>
        <button
          className="text-color-brand-primary text-sm font-medium"
          onClick={() => handleOpenModal('newTaskList')}
        >
          + 새로운 목록 추가하기
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskLists" direction="vertical">
          {(provided) => (
            <div
              className="flex flex-col gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {taskLists.map((taskList, index) => (
                <Draggable
                  key={taskList.id}
                  draggableId={String(taskList.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskItem
                        taskList={taskList}
                        index={index}
                        groupId={groupId}
                        taskListId={taskList.id}
                        onDelete={() => refetch()}
                        onEdit={handleEdit}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        id="newTaskList"
        className="sm:w-96 w-full p-6 rounded-2xl bg-background-secondary text-text-primary fixed sm:top-1/2 sm:left-1/2 sm:right-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 top-auto bottom-0 left-0 right-0 transform-none rounded-t-xl sm:rounded-b-xl rounded-b-none"
        positionBottom
      >
        <div className="flex flex-col">
          <button
            onClick={() => handleCloseModal('newTaskList')}
            className="ml-auto text-gray-400 hover:text-white mb-2"
          >
            <XIcon />
          </button>
          <p className="text-center text-lg font-medium mb-4">할 일 목록</p>

          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="목록 명을 입력해주세요."
            className="w-[280px] mx-auto p-3 bg-background-secondary text-text-primary rounded-xl mb-6 border border-text-default focus:outline-none placeholder-text-default"
          />
          <button
            onClick={handleCreateList}
            className="w-[280px] mx-auto bg-color-brand-primary text-white py-3 rounded-xl font-medium hover:bg-[#0d9668] transition-colors"
          >
            만들기
          </button>
        </div>
      </Modal>

      <Modal
        id="editTaskList"
        className="sm:w-96 w-full p-6 rounded-2xl bg-background-secondary text-text-primary fixed sm:top-1/2 sm:left-1/2 sm:right-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 top-auto bottom-0 left-0 right-0 transform-none rounded-t-xl sm:rounded-b-xl rounded-b-none"
        positionBottom
      >
        <div className="flex flex-col">
          <button
            onClick={() => handleCloseModal('editTaskList')}
            className="ml-auto text-gray-400 hover:text-white mb-2"
          >
            <XIcon />
          </button>
          <p className="text-center text-lg font-medium mb-4">
            할 일 목록 수정
          </p>

          <input
            type="text"
            value={editingListName}
            onChange={(e) => setEditingListName(e.target.value)}
            className="w-[280px] mx-auto p-3 bg-background-secondary text-text-primary rounded-xl mb-6 border border-text-default focus:outline-none placeholder-text-default"
          />
          <button
            onClick={handleEditList}
            className="w-[280px] mx-auto bg-color-brand-primary text-white py-3 rounded-xl font-medium hover:bg-[#0d9668] transition-colors"
          >
            수정하기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskListCard;
