import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import {
    LogBox,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePlannerStore } from '../store/planner.store'

import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

import { useModalStore } from '@/modules/modal'

import MonthCalendar from '../components/calendar/month-calendar'
import NearbyTasksCard from '../components/calendar/nearby-tasks-card'
import TasksSection from '../components/tasks/tasks-section'

import MainHeader from '@/shared/components/headers/main-header'
import AddPlus from '@/shared/ui/add-plus'
import Button from '@/shared/ui/button/button'
import DayTasksCard from '../components/calendar/day-tasks-card'
import PlannerHeader from '../components/header/planner-header'
import { usePlannerScreen } from '../hooks/usePlannerScreen'
import {
    addMonths,
    formatSelectedDayTitle,
    selectedDayTasksSubtitle,
} from '../utils/planner-date'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { Nav } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { toApiError } from '@/api/http/errors'

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews'])

export default function PlannerScreen() {
    const styles = useStyles()
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const { open, close } = useModalStore()

    const {
        today,
        showAllTasks,
        selectedDate,
        visibleMonth,

        upcomingExpanded,
        pastExpanded,

        upcoming,
        past,
        marks,

        setShowAllTasks,

        setSelectedDate,
        setVisibleMonth,

        setSectionExpanded,
        toggleCompleted,
        addTask,
        removeTask,
        nearbyMode,
        nearbyTask,
        nearbyCount,
        tasksForSelectedDate,
        openAllTasksFocusNearby,
        isFetching,
    } = usePlannerScreen()

    const selectedTitle = useMemo(
        () => formatSelectedDayTitle(selectedDate, today),
        [selectedDate, today],
    )

    const { show } = useToast()

    const openAddTaskModal = () => {
        open('plannerTask', {
            initialDate: selectedDate,
            onSubmit: async (payload: { title: string; date: string; time?: string }) => {
                try {
                    await addTask(payload)
                    close()
                    show('Задача добавлена', 'success', {
                        scope: TOAST_SCOPES.Planner,
                    })
                } catch (e) {
                    show(toApiError(e).message, 'error', {
                        scope: TOAST_SCOPES.Planner,
                    })
                }
            },
        })
    }

    const onPressTask = (item: any) => {
        if (item.kind === 'order') {
            navigation.navigate('OrderInfo', { orderId: item.orderId })
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            await removeTask(taskId)
            show('Задача удалена', 'success', {
                scope: TOAST_SCOPES.Planner,
            })
        } catch (e) {
            show(toApiError(e).message, 'error', {
                scope: TOAST_SCOPES.Planner,
            })
        }
    }

    const handleSelectDate = (dateKey: string) => {
        setSelectedDate(dateKey)
    }

    const toggleUpcomingExpanded = () => {
        const next = !upcomingExpanded
        setSectionExpanded('upcoming', next)
        if (next) setSectionExpanded('past', false)
    }

    const togglePastExpanded = () => {
        const next = !pastExpanded
        setSectionExpanded('past', next)
        if (next) setSectionExpanded('upcoming', false)
    }

    const hasHydrated = usePlannerStore(s => s.hasHydrated)

    if (!hasHydrated) {
        return (
            <ScreenContainer>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator />
                </View>
            </ScreenContainer>
        )
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <MainHeader />
                <PlannerHeader
                    tasksActive={showAllTasks}
                    onTasksPress={() => setShowAllTasks(true)}
                    onPlannerPress={() => setShowAllTasks(false)}
                />

                {!showAllTasks ? (
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={[
                            styles.calendarTab,
                            { paddingBottom: bottom + 90 },
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                    >
                        <MonthCalendar
                            monthStart={visibleMonth}
                            selectedDate={selectedDate}
                            today={today}
                            upcomingDates={marks.upcoming}
                            pastDates={marks.past}
                            onSelect={handleSelectDate}
                            onPrevMonth={() =>
                                setVisibleMonth(addMonths(visibleMonth, -1))
                            }
                            onNextMonth={() =>
                                setVisibleMonth(addMonths(visibleMonth, 1))
                            }
                        />

                        <View style={styles.dayRow}>
                            <View style={styles.dayTitleBox}>
                                <Text style={styles.dayTitle}>{selectedTitle}</Text>
                                {isFetching && <ActivityIndicator />}
                            </View>
                            <AddPlus onPress={openAddTaskModal} small />
                        </View>

                        <Text style={styles.blockTitle}>
                            {selectedDayTasksSubtitle(selectedDate, today)}
                        </Text>

                        <DayTasksCard
                            tasks={tasksForSelectedDate as any}
                            onPress={openAllTasksFocusNearby}
                        />

                        <Text style={styles.blockTitle}>
                            {nearbyMode === 'past'
                                ? 'Прошедшие задачи'
                                : 'Ближайшие задачи'}
                        </Text>

                        <NearbyTasksCard
                            nextTask={nearbyTask as any}
                            upcomingCount={nearbyCount}
                            onPress={openAllTasksFocusNearby}
                        />
                    </ScrollView>
                ) : (
                    <View style={[styles.allTasksTab, { paddingBottom: bottom + 90 }]}>
                        {isFetching ? (
                            <View style={styles.fetchingRow}>
                                <ActivityIndicator />
                                <Text style={styles.fetchingText}>
                                    Обновляем задачи...
                                </Text>
                            </View>
                        ) : null}

                        <View style={styles.sectionsWrap}>
                            <TasksSection
                                title="Ближайшие задачи"
                                variant="upcoming"
                                expanded={upcomingExpanded}
                                selectedDate={selectedDate}
                                items={upcoming as any}
                                onToggleExpanded={toggleUpcomingExpanded}
                                onToggleCompleted={toggleCompleted}
                                onPressItem={onPressTask}
                                onDeleteTask={taskId => {
                                    void handleDeleteTask(taskId)
                                }}
                            />

                            <View style={{ height: 12 }} />

                            <TasksSection
                                title="Прошедшие задачи"
                                variant="past"
                                expanded={pastExpanded}
                                selectedDate={selectedDate}
                                items={past as any}
                                onToggleExpanded={togglePastExpanded}
                                onToggleCompleted={toggleCompleted}
                                onPressItem={onPressTask}
                                onDeleteTask={taskId => {
                                    void handleDeleteTask(taskId)
                                }}
                            />
                        </View>

                        <View style={styles.footerWrap}>
                            <Button title="Добавить задачу" onPress={openAddTaskModal} />
                        </View>
                    </View>
                )}
            </View>
            <ToastViewport
                scope={TOAST_SCOPES.Planner}
                bottomOffset={90}
                horizontalInset={15}
            />
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scroll: {
            flex: 1,
        },
        calendarTab: {
            gap: 12,
        },
        dayRow: {
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        dayTitleBox: {
            flexDirection: 'row',
            gap: 20,
        },
        dayTitle: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 20,
            color: theme.colors.text,
        },
        blockTitle: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 16,
            color: theme.colors.text,
        },
        allTasksTab: {
            flex: 1,
            marginTop: -1,
        },
        sectionsWrap: {
            paddingTop: 0,
        },
        footerWrap: {
            paddingTop: 18,
        },
        fetchingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        fetchingText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.textMuted,
        },
    }),
)
