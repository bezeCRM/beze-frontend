import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

import { useModalStore } from '@/modules/modal'

import MonthCalendar from '../components/calendar/month-calendar'
import NearbyTasksCard from '../components/calendar/nearby-tasks-card'
import TasksSection from '../components/tasks/tasks-section'

import { usePlannerScreen } from '../hooks/usePlannerScreen'
import { addMonths, formatSelectedDayTitle } from '../utils/planner-date'
import PlannerHeader from '../components/header/planner-header'
import MainHeader from '@/shared/components/headers/main-header'

export default function PlannerScreen() {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<any>()
    const { open } = useModalStore()

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
        nextUpcoming,
        nearbyUpcomingCount,

        setShowAllTasks,
        openAllTasksFocusUpcoming,

        setSelectedDate,
        setVisibleMonth,

        setSectionExpanded,
        toggleCompleted,
        addTask,
    } = usePlannerScreen()

    const selectedTitle = useMemo(
        () => formatSelectedDayTitle(selectedDate, today),
        [selectedDate, today],
    )

    const openAddTaskModal = () => {
        open('plannerTask', {
            initialDate: selectedDate,
            onSubmit: (payload: { title: string; date: string; time?: string }) => {
                addTask(payload)
                open('status', {
                    title: 'Добавление задачи',
                    message: 'Задача успешно добавлена!',
                    success: true,
                })
            },
        })
    }

    const onPressTask = (item: any) => {
        if (item.kind === 'order') {
            navigation.navigate('OrderInfo', { orderId: item.orderId })
        }
    }

    const handleSelectDate = (dateKey: string) => {
        setSelectedDate(dateKey)
    }

    type AllTasksContainerItem = { id: 'content' }
    const ALL_TASKS_LIST_DATA: AllTasksContainerItem[] = [{ id: 'content' }]

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <MainHeader />
                <PlannerHeader
                    TasksActive={showAllTasks}
                    onTasksPress={() => setShowAllTasks(!showAllTasks)}
                />

                {!showAllTasks ? (
                    <View style={styles.calendarTab}>
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
                            <Text style={styles.dayTitle}>{selectedTitle}</Text>
                            <Pressable onPress={openAddTaskModal} style={styles.plusBtn}>
                                <Ionicons name="add" size={22} color={colors.brand} />
                            </Pressable>
                        </View>

                        <Text style={styles.blockTitle}>Ближайшие задачи</Text>

                        <NearbyTasksCard
                            nextTask={nextUpcoming as any}
                            upcomingCount={nearbyUpcomingCount}
                            onPress={() => {
                                openAllTasksFocusUpcoming()
                                setSectionExpanded('upcoming', true)
                                setSectionExpanded('past', false)
                            }}
                        />
                    </View>
                ) : (
                    <FlatList<AllTasksContainerItem>
                        data={ALL_TASKS_LIST_DATA}
                        keyExtractor={item => item.id}
                        renderItem={() => null}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: bottom + 20 }}
                        ListHeaderComponent={
                            <View style={styles.allTasksTab}>
                                <TasksSection
                                    title="Ближайшие задачи"
                                    variant="upcoming"
                                    expanded={upcomingExpanded}
                                    selectedDate={selectedDate}
                                    items={upcoming as any}
                                    onToggleExpanded={() =>
                                        setSectionExpanded('upcoming', !upcomingExpanded)
                                    }
                                    onToggleCompleted={toggleCompleted}
                                    onPressItem={onPressTask}
                                />

                                <View style={{ height: 12 }} />

                                <TasksSection
                                    title="Прошедшие задачи"
                                    variant="past"
                                    expanded={pastExpanded}
                                    selectedDate={selectedDate}
                                    items={past as any}
                                    onToggleExpanded={() =>
                                        setSectionExpanded('past', !pastExpanded)
                                    }
                                    onToggleCompleted={toggleCompleted}
                                    onPressItem={onPressTask}
                                />

                                <View style={{ height: 18 }} />
                            </View>
                        }
                        ListFooterComponent={
                            <View style={styles.footerWrap}>
                                <Pressable
                                    onPress={openAddTaskModal}
                                    style={styles.addBtn}
                                >
                                    <Text style={styles.addBtnText}>Добавить задачу</Text>
                                </Pressable>
                            </View>
                        }
                    />
                )}
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        stickyTopBar: {
            paddingTop: 10,
        },
        headerTitle: {
            marginBottom: 10,
        },
        calendarTab: {
            paddingTop: 4,
            gap: 12,
        },
        dayRow: {
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        dayTitle: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 20,
            color: theme.colors.text,
        },
        plusBtn: {
            width: 36,
            height: 36,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
        },
        blockTitle: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 16,
            color: theme.colors.text,
        },
        allTasksTab: {
            paddingTop: 8,
        },
        addBtn: {
            backgroundColor: theme.colors.brand,
            height: 56,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        addBtnText: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 16,
            color: theme.colors.fixedWhite,
        },
        footerWrap: {
            paddingHorizontal: 20,
        },
    }),
)
