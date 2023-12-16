import { TSchedule } from './offeredCourses.interface'

export const hasTimeConflict = (
  assignSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`)
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`)

    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`)
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true
      // throw new AppError(
      //   httpStatus.CONFLICT,
      //   `Time clashed. Please choose another time or day.`,
      // )
    }
  }

  return false
}
