import { useState } from 'react';
import { useRouter } from 'next/router';
import ListLayout from '@/components/list/ListLayout';
import WorkToDoContainer from '@/components/list/WorkToDoContainer';
import FloatingButton from '@/components/common/FloatingButton';
import WorkToDoDetail from '@/components/list/WorkToDoDetail';
import CreateWorkToDoModal from '@/components/list/CreateWorkToDoModal';
import EditWorkToDoModal from '@/components/list/EditWorkToDoModal';
import DeleteWorkToDoModal from '@/components/list/DeleteWorkToDoModal';
import DeleteCommentModal from '@/components/list/DeleteCommentModal';
import useModalStore from '@/store/modalStore';
import { useTasksQuery } from '@/lib/taskApi';
import { formatThirdDate } from '@/utils/formatDate';
import useSelectedDateStore from '@/store/selectedDateStore';
import { TaskResponse } from '@/types/listTypes';

export default function Task() {
  const router = useRouter();
  const { tasklistid } = router.query;
  const { taskId } = router.query;
  const { openModal } = useModalStore();
  const { selectedDate } = useSelectedDateStore();

  const taskListId = Number(tasklistid);

  const [workToDoName, setWorkToDoName] = useState('');

  const formattedDate = formatThirdDate(selectedDate);

  const tasksQuery = useTasksQuery(869, taskListId, formattedDate);

  return (
    <>
      <CreateWorkToDoModal />
      <EditWorkToDoModal />
      <DeleteWorkToDoModal workToDoName={workToDoName} />
      <DeleteCommentModal />
      {taskId && <WorkToDoDetail setWorkToDoName={setWorkToDoName} />}
      <ListLayout>
        {tasksQuery.data?.data.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tasksQuery.data?.data.map((data: TaskResponse) => (
              <div key={data.id}>
                <WorkToDoContainer
                  data={{ ...data }}
                  setWorkToDoName={setWorkToDoName}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-md font-medium text-text-default">
            <p>아직 할 일 목록이 없습니다.</p>
            <p>새로운 목록을 추가해주세요.</p>
          </div>
        )}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-12 2lg:custom-right">
          <FloatingButton
            option="add"
            text="할 일 추가"
            disabled={false}
            onClick={() => openModal('createToDo')}
          />
        </div>
      </ListLayout>
    </>
  );
}
