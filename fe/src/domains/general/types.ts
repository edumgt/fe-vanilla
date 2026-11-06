export interface DepartmentRecord {
  Key: string;
  rowKey: number;
  tpCd: string;
  tpNm: string;
  descCntn: string;
  useYn: 'Y' | 'N';
  createdAt: string;
  _attributes?: {
    rowNum: number;
    checked: boolean;
    disabled: boolean;
  };
}

export interface WmsInventoryItem {
  id: string;
  date: string;
  title: string;
  quantity: number;
  isbn: string;
}

export interface CalendarEventItem {
  eventId: string;
  dateKey: string;
  time: string;
  description: string;
}

export interface MemberRecord {
  id: string;
  employeeId: string;
  name: string;
  team: string;
  email: string;
  address: string;
  joinYear: string;
}

export interface CodeGroupItem {
  groupcode: string;
  groupname: string;
  enabletype: string;
  regsitecode: string;
}
