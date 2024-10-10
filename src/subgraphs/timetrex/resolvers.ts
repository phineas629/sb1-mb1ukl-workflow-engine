import { TimeTrexService } from './TimeTrexService';

export const resolvers = {
  Query: {
    getEmployee: (_, { id }, { timeTrexService }: { timeTrexService: TimeTrexService }) =>
      timeTrexService.getEmployee(id),
    getTimeEntries: (
      _,
      { employeeId, startDate, endDate },
      { timeTrexService }: { timeTrexService: TimeTrexService },
    ) => timeTrexService.getTimeEntries(employeeId, startDate, endDate),
  },
  Mutation: {
    createTimeEntry: (
      _,
      { employeeId, date, startTime, endTime },
      { timeTrexService }: { timeTrexService: TimeTrexService },
    ) => timeTrexService.createTimeEntry(employeeId, date, startTime, endTime),
  },
};
