import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

export class StoreService {
  private static instance: StoreService;

  public codes: any[] = [];
  public departmentRows: any[] = [];
  public codeGroups: any[] = [];
  public codeDetails: Record<string, any[]> = {};
  public sitePlaceRooms: any[] = [];
  public calendarEvents: Record<string, Array<{ time: string; description: string; eventId: string }>> = {};
  public calendarDateToId: Record<string, number> = {};
  public calendarIdToDate: Record<number, string> = {};
  private calendarSeq = 1;

  public members: any[] = [];
  public glossaryRows: any[] = [];
  public glossaryRequests: any[] = [];
  public inboundRows: any[] = [];
  public outboundRows: any[] = [];
  public todos: any[] = [];
  public hotelBookings: Record<string, any[]> = {};
  public medicalReservations: any[] = [];

  private constructor() {
    this.init();
  }

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  private loadJson(filename: string, fallback: any = []) {
    const fullPath = path.join(ENV.MOCK_DIR, filename);
    try {
      if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      }
    } catch (e) {
      console.warn(`[StoreService] Failed to load ${filename}, using fallback:`, e);
    }
    return fallback;
  }

  public getOrCreateCalendarDateId(dateKey: string): number {
    if (this.calendarDateToId[dateKey]) {
      return this.calendarDateToId[dateKey];
    }
    const dateId = this.calendarSeq++;
    this.calendarDateToId[dateKey] = dateId;
    this.calendarIdToDate[dateId] = dateKey;
    return dateId;
  }

  public seedCalendar() {
    const seeds = [
      { time: '09:00', desc: 'Sprint planning', offset: 0 },
      { time: '13:30', desc: 'API contract review', offset: 1 },
      { time: '16:00', desc: 'Demo walkthrough', offset: 2 },
    ];
    const now = new Date();
    seeds.forEach(({ time, desc, offset }) => {
      const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().slice(0, 10);
      const dateId = this.getOrCreateCalendarDateId(dateKey);
      const eventId = `CAL-${String(dateId).padStart(3, '0')}-${time.replace(':', '')}`;
      this.calendarEvents[dateKey] = this.calendarEvents[dateKey] || [];
      if (!this.calendarEvents[dateKey].some((item) => item.eventId === eventId)) {
        this.calendarEvents[dateKey].push({ time, description: desc, eventId });
      }
    });
  }

  private init() {
    // 1. Departments / Mock
    try {
      const rawMock = this.loadJson('mock.json', []);
      const todayStr = new Date().toISOString().slice(0, 10);
      this.departmentRows = rawMock.map((row: any, idx: number) => ({
        ...row,
        Key: row.Key || crypto.randomUUID(),
        rowKey: parseInt(row.rowKey, 10) || idx + 1,
        useYn: row.useYn || 'Y',
        createdAt: row.createdAt || todayStr,
        _attributes: row._attributes || {
          rowNum: parseInt(row.rowKey, 10) || idx + 1,
          checked: false,
          disabled: false,
          checkDisabled: false,
          className: { row: [], column: {} },
        },
      }));
    } catch {
      this.departmentRows = [];
    }

    // 2. Glossary
    try {
      const rawGlos = this.loadJson('glos.json', []);
      const now = new Date();
      this.glossaryRows = rawGlos.map((row: any, idx: number) => {
        const d = new Date(now.getTime() - idx * 24 * 60 * 60 * 1000);
        return {
          id: idx + 1,
          en: row.en || '',
          ko: row.ko || '',
          desc: row.desc || '',
          img: row.img || '',
          createdAt: d.toISOString().slice(0, 10),
        };
      });
    } catch {
      this.glossaryRows = [];
    }

    // 3. Members
    const TEAMS = ['Consulting', 'Operations', 'Platform', 'Sales', 'Support', 'Planning'];
    const CITIES = ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'];
    this.members = Array.from({ length: 12 }, (_, i) => {
      const idx = i + 1;
      const numStr = idx < 10 ? `0${idx}` : `${idx}`;
      return {
        id: `user${numStr}`,
        employeeId: `EMP-00${numStr}`,
        name: `Demo Member ${idx}`,
        team: TEAMS[i % TEAMS.length],
        email: `user${numStr}@example.com`,
        address: `${CITIES[i % CITIES.length]} Demo-ro ${idx * 3}`,
        joinYear: String(2018 + (idx % 6)),
      };
    });

    // 4. Inbound / Outbound
    const today = new Date();
    this.inboundRows = Array.from({ length: 25 }, (_, i) => {
      const idx = i + 1;
      const numStr = idx < 10 ? `00${idx}` : `0${idx}`;
      const d = new Date(today.getTime() - idx * 24 * 60 * 60 * 1000);
      return {
        id: `INB-${numStr}`,
        date: d.toISOString().slice(0, 10),
        title: `Inbound Item ${idx}`,
        quantity: Math.floor(Math.random() * 175) + 5,
        isbn: `97889${String(idx).padStart(7, '0')}`,
      };
    });

    this.outboundRows = Array.from({ length: 25 }, (_, i) => {
      const idx = i + 1;
      const numStr = idx < 10 ? `00${idx}` : `0${idx}`;
      const d = new Date(today.getTime() - idx * 24 * 60 * 60 * 1000);
      return {
        id: `OUT-${numStr}`,
        date: d.toISOString().slice(0, 10),
        title: `Outbound Item ${idx}`,
        quantity: Math.floor(Math.random() * 175) + 5,
        isbn: `97889${String(idx).padStart(7, '0')}`,
      };
    });

    // 5. Code groups & Details
    const todayDateStr = new Date().toISOString().slice(0, 10);
    this.codeGroups = [
      { groupcode: 'ROOM', groupname: 'Room Codes', enabletype: 'Y', regsitecode: 'HQ' },
      { groupcode: 'DEPT', groupname: 'Department Codes', enabletype: 'Y', regsitecode: 'HQ' },
      { groupcode: 'CITY', groupname: 'City Codes', enabletype: 'Y', regsitecode: 'SEOUL' },
    ];
    this.codeDetails = {
      ROOM: [
        { codevalue: 'ROOM-A', codename: 'Auditorium A', regemp: 'system', regdate: todayDateStr, remark: 'Large event hall' },
        { codevalue: 'ROOM-B', codename: 'Training Room B', regemp: 'system', regdate: todayDateStr, remark: 'Training space' },
      ],
      DEPT: [
        { codevalue: 'OPS', codename: 'Operations', regemp: 'system', regdate: todayDateStr, remark: 'Core operations' },
        { codevalue: 'CS', codename: 'Customer Success', regemp: 'system', regdate: todayDateStr, remark: 'Customer support team' },
      ],
      CITY: [
        { codevalue: 'SEL', codename: 'Seoul', regemp: 'system', regdate: todayDateStr, remark: 'Capital city' },
        { codevalue: 'BSN', codename: 'Busan', regemp: 'system', regdate: todayDateStr, remark: 'Port city' },
      ],
    };

    // 6. Site Place Rooms
    this.sitePlaceRooms = [
      { sitecode: '01', sitename: 'North Campus', placename: 'Main Building', placeseq: 1, roomname: 'Room 101', allseat: 32, disableseat: 2, employeeseat: 4, timetype: 'FULL', enabletype: 'Y', ordering: 1, roomment: 'Room 101 ready for demo use', sortorder: 1, roomcolor: '#60a5fa' },
      { sitecode: '01', sitename: 'North Campus', placename: 'Main Building', placeseq: 1, roomname: 'Room 102', allseat: 24, disableseat: 1, employeeseat: 2, timetype: 'FULL', enabletype: 'Y', ordering: 2, roomment: 'Room 102 ready for demo use', sortorder: 2, roomcolor: '#60a5fa' },
      { sitecode: '01', sitename: 'North Campus', placename: 'Annex', placeseq: 2, roomname: 'Lab 201', allseat: 18, disableseat: 0, employeeseat: 1, timetype: 'FULL', enabletype: 'Y', ordering: 3, roomment: 'Lab 201 ready for demo use', sortorder: 3, roomcolor: '#60a5fa' },
      { sitecode: '02', sitename: 'South Campus', placename: 'Tower A', placeseq: 1, roomname: 'Hall 301', allseat: 40, disableseat: 3, employeeseat: 6, timetype: 'FULL', enabletype: 'Y', ordering: 4, roomment: 'Hall 301 ready for demo use', sortorder: 4, roomcolor: '#60a5fa' },
      { sitecode: '02', sitename: 'South Campus', placename: 'Tower A', placeseq: 1, roomname: 'Hall 302', allseat: 28, disableseat: 2, employeeseat: 3, timetype: 'FULL', enabletype: 'Y', ordering: 5, roomment: 'Hall 302 ready for demo use', sortorder: 5, roomcolor: '#60a5fa' },
      { sitecode: '02', sitename: 'South Campus', placename: 'Tower B', placeseq: 2, roomname: 'Studio 401', allseat: 20, disableseat: 1, employeeseat: 2, timetype: 'FULL', enabletype: 'Y', ordering: 6, roomment: 'Studio 401 ready for demo use', sortorder: 6, roomcolor: '#60a5fa' },
    ];

    // 7. Seed Calendar
    this.seedCalendar();

    // 8. Todos
    this.todos = [
      { id: 1, title: '시스템 점검', description: '매월 첫째 주 서버 및 보안 점검', created_at: new Date().toISOString() },
      { id: 2, title: '분기 실적 보고서 작성', description: '재무팀 및 기획팀 데이터 취합', created_at: new Date().toISOString() },
    ];

    // 9. Bookings & Reservations
    this.hotelBookings = {
      '1-1': [{ guestName: '김민수', checkInDate: '2026-01-10', checkOutDate: '2026-01-12', arrivalTime: '14:00', departureTime: '11:00', cost: 180000 }],
      '2-3': [{ guestName: '박지은', checkInDate: '2026-01-11', checkOutDate: '2026-01-13', arrivalTime: '15:00', departureTime: '10:00', cost: 230000 }],
      '5-14': [{ guestName: '홍길동', checkInDate: '2026-01-12', checkOutDate: '2026-01-15', arrivalTime: '13:30', departureTime: '11:30', cost: 320000 }],
    };

    this.medicalReservations = [
      { id: 1, name: '이수진', departmentId: 1, date: '2026-01-10', time: '09:30' },
      { id: 2, name: '최현우', departmentId: 4, date: '2026-01-10', time: '10:15' },
      { id: 3, name: '강다은', departmentId: 7, date: '2026-01-10', time: '14:00' },
      { id: 4, name: '조영호', departmentId: 2, date: '2026-01-11', time: '11:45' },
    ];
  }
}
