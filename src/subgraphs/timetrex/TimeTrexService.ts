import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

interface Database {
  employees: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  time_entries: {
    id: number;
    employee_id: number;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
  };
}

@injectable()
export class TimeTrexService {
  private db: Kysely<Database>;
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
    this.apiUrl = process.env.TIMETREX_API_URL || '';
    this.apiKey = process.env.TIMETREX_API_KEY || '';
  }

  async getEmployee(id: string) {
    const employee = await this.db
      .selectFrom('employees')
      .where('id', '=', parseInt(id))
      .selectAll()
      .executeTakeFirst();

    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      id: employee.id.toString(),
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
    };
  }

  async getTimeEntries(employeeId: string, startDate: string, endDate: string) {
    const timeEntries = await this.db
      .selectFrom('time_entries')
      .where('employee_id', '=', parseInt(employeeId))
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .selectAll()
      .execute();

    return timeEntries.map((entry) => ({
      id: entry.id.toString(),
      employeeId: entry.employee_id.toString(),
      date: entry.date,
      startTime: entry.start_time,
      endTime: entry.end_time,
      duration: entry.duration,
    }));
  }

  async createTimeEntry(employeeId: string, date: string, startTime: string, endTime: string) {
    // Call TimeTrex API to create time entry
    const response = await fetch(`${this.apiUrl}/time_entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        employee_id: employeeId,
        date,
        start_time: startTime,
        end_time: endTime,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create time entry in TimeTrex');
    }

    const timeTrexEntry = await response.json();

    // Store the entry in our local database
    const [createdEntry] = await this.db
      .insertInto('time_entries')
      .values({
        employee_id: parseInt(employeeId),
        date,
        start_time: startTime,
        end_time: endTime,
        duration: timeTrexEntry.duration,
      })
      .returning(['id', 'employee_id', 'date', 'start_time', 'end_time', 'duration'])
      .execute();

    return {
      id: createdEntry.id.toString(),
      employeeId: createdEntry.employee_id.toString(),
      date: createdEntry.date,
      startTime: createdEntry.start_time,
      endTime: createdEntry.end_time,
      duration: createdEntry.duration,
    };
  }
}
