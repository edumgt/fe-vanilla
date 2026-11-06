import { ApiClient } from '../../shared/api/client.js';
import { DepartmentRecord, WmsInventoryItem, MemberRecord, CodeGroupItem } from './types.js';

export const GeneralApi = {
  // Department Data
  getDepartments: () => ApiClient.get<DepartmentRecord[]>('/api/data'),
  saveDepartment: (record: Partial<DepartmentRecord>) => ApiClient.post('/api/save', record),
  deleteDepartments: (rowKeys: number[]) => ApiClient.post('/api/delete', { rowKeys }),

  // WMS Inventory
  getInbound: () => ApiClient.get<WmsInventoryItem[]>('/db/inbound'),
  getOutbound: () => ApiClient.get<WmsInventoryItem[]>('/db/outbound'),
  addInbound: (item: Partial<WmsInventoryItem>) => ApiClient.post('/db/inbound/add', item),
  addOutbound: (item: Partial<WmsInventoryItem>) => ApiClient.post('/db/outbound/add', item),

  // Calendar
  getCalendar: () => ApiClient.get<Record<string, string[]>>('/api/calendar'),
  seedCalendar: () => ApiClient.post('/api/calendar/mock-seed'),
  addDate: (date: string) => ApiClient.post<{ dateId: number }>('/api/addDate', { date }),
  addEvent: (payload: { date_id: number; time: string; description: string; event_id?: string }) =>
    ApiClient.post('/api/addEvent', payload),
  deleteEvent: (eventId: string) => ApiClient.delete(`/api/deleteEvent/${eventId}`),

  // Members & Codes
  getMembers: () => ApiClient.get<MemberRecord[]>('/api/members'),
  getCodeGroups: () => ApiClient.get<CodeGroupItem[]>('/api/codegroup'),
  getCodeDetails: (groupcode: string) => ApiClient.get<any[]>('/api/code', { groupcode }),

  // Dynamic Query
  runQuery: (query: string) => ApiClient.post('/db/query', { query }),
};
