import { http } from '@/api'
import type { PlannerTask } from '@/shared/types/types'

export type PlannerTaskUpsertRequest = {
    title: string
    date: string
    time?: string
}

type PlannerTaskApiDto = Omit<PlannerTask, 'time'> & {
    time?: string | null
}

export type PlannerTasksRangeParams = {
    from: string
    to: string
}

function mapPlannerTaskFromApi(dto: PlannerTaskApiDto): PlannerTask {
    return {
        ...dto,
        time: dto.time ?? undefined,
    }
}

export async function getPlannerTasks(
    params: PlannerTasksRangeParams,
): Promise<PlannerTask[]> {
    const { data } = await http.get<PlannerTaskApiDto[]>('/planner/tasks', {
        params: {
            from: params.from,
            to: params.to,
        },
    })
    return data.map(mapPlannerTaskFromApi)
}

export async function getPlannerTaskById(id: string): Promise<PlannerTask> {
    const { data } = await http.get<PlannerTaskApiDto>(`/planner/tasks/${id}`)
    return mapPlannerTaskFromApi(data)
}

export async function createPlannerTask(
    payload: PlannerTaskUpsertRequest,
): Promise<PlannerTask> {
    const { data } = await http.post<PlannerTaskApiDto>('/planner/tasks', payload)
    return mapPlannerTaskFromApi(data)
}

export async function updatePlannerTaskApi(
    id: string,
    payload: PlannerTaskUpsertRequest,
): Promise<PlannerTask> {
    const { data } = await http.put<PlannerTaskApiDto>(`/planner/tasks/${id}`, payload)
    return mapPlannerTaskFromApi(data)
}

export async function deletePlannerTaskApi(id: string): Promise<void> {
    await http.delete(`/planner/tasks/${id}`)
}
