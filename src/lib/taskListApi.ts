import { basicAuthAxios } from './basicAxios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CreateTaskListParams } from '@/types/listTypes';

// 할 일 리스트 생성 (사용중)
const createTaskList = async ({ groupId, name }: CreateTaskListParams) => {
  return basicAuthAxios.post(`/groups/${groupId}/task-lists`, { name });
};

export const useCreateTaskListMutation = () => {
  return useMutation({
    mutationFn: createTaskList,
  });
};

// 할 일 리스트 불러오기 (사용중)
const getTaskLists = (groupId: number) => {
  return basicAuthAxios.get(`/groups/${groupId}`);
};

export const useTaskListsQuery = (groupId: number) => {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => getTaskLists(groupId),
  });
};

// 특정 할 일 리스트 불러오기
const getTaskListDetail = (groupId: number, taskListId: number) => {
  return basicAuthAxios.get(`/groups/${groupId}/task-lists/${taskListId}`);
};

export const useTaskListDetailQuery = (groupId: number, taskListId: number) => {
  return useQuery({
    queryKey: ['groups', groupId, 'taskLists', taskListId],
    queryFn: () => getTaskListDetail(groupId, taskListId),
  });
};

// 특정 할 일 리스트 수정
const editTaskListDetail = (
  groupId: number,
  taskListId: number,
  name: string,
) => {
  return basicAuthAxios.patch(`/groups/${groupId}/task-lists/${taskListId}`, {
    name: name,
  });
};

export const useEditTaskListDetailMutation = (
  groupId: number,
  taskListId: number,
  name: string,
) => {
  return useMutation({
    mutationFn: () => editTaskListDetail(groupId, taskListId, name),
  });
};

// 특정 할 일 리스트 삭제
const deleteTaskListDetail = (groupId: number, taskListId: number) => {
  return basicAuthAxios.delete(`/groups/${groupId}/task-lists/${taskListId}`);
};

export const useDeleteTaskListDetailMutation = (
  groupId: number,
  taskListId: number,
) => {
  return useMutation({
    mutationFn: () => deleteTaskListDetail(groupId, taskListId),
  });
};

// 특정 할 일 리스트 순서 변경
const orderTaskListDetail = (
  groupId: number,
  taskListId: number,
  displayIndex: number,
) => {
  return basicAuthAxios.patch(
    `/groups/${groupId}/task-lists/${taskListId}/order`,
    {displayIndex},
  );
};

export const useOrderTaskListDetailMutation = (
) => {
  return useMutation({
    mutationFn: ({ groupId, taskListId, displayIndex }: { groupId: number, taskListId: number, displayIndex: number }) => 
      orderTaskListDetail(groupId, taskListId, displayIndex),
  });
};

const getUserGroups = () => {
  return basicAuthAxios.get('/user/groups');
};

export const useUserGroupsQuery = () => {
  return useQuery({
    queryKey: ['user', 'groups'],
    queryFn: getUserGroups,
  });
};