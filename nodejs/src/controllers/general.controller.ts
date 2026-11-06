import { Request, Response } from 'express';
import crypto from 'crypto';
import { StoreService } from '../services/store.service.js';

const store = StoreService.getInstance();

export class GeneralController {
  // Menu
  public static getMenu(_req: Request, res: Response) {
    const MENU_ENABLED_PAGES = [
      'system.html', 'glos.html', 'orgtree.html', 'document.html', 'wms.html',
      'calendar.html', 'trello.html', 'timeline.html', 'orgni.html', 'attend.html',
      'total.html', 'stati.html', 'flow.html', 'chain.html', 'work.html',
      'meeting.html', 'hospital.html', 'lectures.html', 'city.html', 'config.html',
      'network.html', 'survey.html', 'locker.html', 'kegcode.html', 'kegeditor.html',
      'kegeditor2.html', 'orgsel.html', 'aistock.html', '1.html', '2.html', '3.html',
      '4.html', '5.html', 'account-pop.html'
    ];
    const menuConfig: Record<string, boolean> = {};
    MENU_ENABLED_PAGES.forEach((page) => {
      menuConfig[page] = true;
    });
    res.json(menuConfig);
  }

  // Members
  public static getMembers(_req: Request, res: Response) {
    res.json(store.members);
  }

  // Permissions
  public static getPermissions(req: Request, res: Response) {
    const { memberId, menuPath } = req.query;
    if (!memberId || !menuPath) {
      return res.status(400).json({ detail: 'memberId and menuPath are required' });
    }
    return res.json({
      canSearch: true,
      canAdd: true,
      canDelete: true,
      canResetSearch: true,
      canSave: true,
      canView: true,
    });
  }

  // Department / Grid Data
  public static getData(_req: Request, res: Response) {
    res.json(store.departmentRows);
  }

  public static saveData(req: Request, res: Response) {
    const payload = req.body || {};
    const rowKey = parseInt(payload.rowKey, 10) || (store.departmentRows.length > 0 ? Math.max(...store.departmentRows.map((r) => r.rowKey)) + 1 : 1);
    const existing = store.departmentRows.find((r) => r.rowKey === rowKey);
    const record = {
      Key: payload.Key || crypto.randomUUID(),
      tpCd: payload.tpCd || '',
      tpNm: payload.tpNm || '',
      descCntn: payload.descCntn || '',
      useYn: payload.useYn || 'Y',
      createdAt: payload.createdAt || new Date().toISOString().slice(0, 10),
      view: payload.view,
      rowKey,
      _attributes: payload._attributes || {
        rowNum: rowKey,
        checked: false,
        disabled: false,
        checkDisabled: false,
        className: { row: [], column: {} },
      },
    };
    if (existing) {
      Object.assign(existing, record);
      return res.json({ message: 'Updated successfully', type: 'update' });
    }
    store.departmentRows.unshift(record);
    return res.json({ message: 'Inserted successfully', type: 'insert' });
  }

  public static deleteData(req: Request, res: Response) {
    const { rowKeys } = req.body || {};
    if (!Array.isArray(rowKeys) || rowKeys.length === 0) {
      return res.status(400).json({ detail: 'rowKeys must be a non-empty array' });
    }
    const targets = new Set(rowKeys.map((k) => parseInt(k, 10)));
    store.departmentRows = store.departmentRows.filter((r) => !targets.has(r.rowKey));
    return res.json({ message: 'Rows deleted successfully', deleted: Array.from(targets) });
  }

  // Inventory / WMS
  public static getInbound(_req: Request, res: Response) {
    res.json(store.inboundRows);
  }

  public static getOutbound(_req: Request, res: Response) {
    res.json(store.outboundRows);
  }

  public static addInbound(req: Request, res: Response) {
    const payload = req.body || {};
    store.inboundRows.unshift({
      id: payload.id || `INB-${crypto.randomUUID().slice(0, 8)}`,
      date: payload.date || new Date().toISOString().slice(0, 10),
      title: payload.title || '',
      quantity: parseInt(payload.quantity, 10) || 0,
      isbn: payload.isbn || '',
    });
    res.json({ success: true, message: 'Inbound data added successfully' });
  }

  public static addOutbound(req: Request, res: Response) {
    const payload = req.body || {};
    store.outboundRows.unshift({
      id: payload.id || `OUT-${crypto.randomUUID().slice(0, 8)}`,
      date: payload.date || new Date().toISOString().slice(0, 10),
      title: payload.title || '',
      quantity: parseInt(payload.quantity, 10) || 0,
      isbn: payload.isbn || '',
    });
    res.json({ success: true, message: 'Outbound data added successfully' });
  }

  public static updateInbound(req: Request, res: Response) {
    const updates = Array.isArray(req.body) ? req.body : [];
    const map = new Map(store.inboundRows.map((r) => [r.id, r]));
    for (const item of updates) {
      const row = map.get(item.id);
      if (row && item.changes) {
        Object.assign(row, item.changes);
      }
    }
    res.json({ success: true, message: 'Inbound data updated' });
  }

  public static updateOutbound(req: Request, res: Response) {
    const updates = Array.isArray(req.body) ? req.body : [];
    const map = new Map(store.outboundRows.map((r) => [r.id, r]));
    for (const item of updates) {
      const row = map.get(item.id);
      if (row && item.changes) {
        Object.assign(row, item.changes);
      }
    }
    res.json({ success: true, message: 'Outbound data updated' });
  }

  public static deleteInbound(req: Request, res: Response) {
    const { ids } = req.body || {};
    if (!Array.isArray(ids)) {
      return res.status(400).json({ detail: 'ids must be an array' });
    }
    const set = new Set(ids);
    store.inboundRows = store.inboundRows.filter((r) => !set.has(r.id));
    return res.json({ success: true, message: 'Selected inbound data deleted successfully' });
  }

  public static deleteOutbound(req: Request, res: Response) {
    const { ids } = req.body || {};
    if (!Array.isArray(ids)) {
      return res.status(400).json({ detail: 'ids must be an array' });
    }
    const set = new Set(ids);
    store.outboundRows = store.outboundRows.filter((r) => !set.has(r.id));
    return res.json({ success: true, message: 'Selected outbound data deleted successfully' });
  }

  // Dynamic Connect & Query
  public static dynamicConnect(req: Request, res: Response) {
    const payload = req.body || {};
    res.json({
      success: true,
      message: 'Demo connection succeeded',
      data: {
        host: payload.host,
        user: payload.user,
        database: payload.database,
        mode: 'demo',
      },
    });
  }

  public static executeQuery(req: Request, res: Response) {
    const query = String(req.body?.query || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ detail: 'query is required' });
    }
    let result: any[] = store.departmentRows;
    if (query.includes('inbound')) result = store.inboundRows;
    else if (query.includes('outbound')) result = store.outboundRows;
    else if (query.includes('member') || query.includes('employee')) result = store.members;
    else if (query.includes('glos')) result = store.glossaryRows;
    else if (query.includes('code')) result = store.codeGroups;

    return res.json({
      success: true,
      message: 'Demo query executed successfully',
      data: result,
    });
  }

  // Calendar
  public static getCalendar(_req: Request, res: Response) {
    const payload: Record<string, string[]> = {};
    for (const [dateKey, events] of Object.entries(store.calendarEvents)) {
      payload[dateKey] = events.map((e) => `${e.time} - ${e.description} - ${e.eventId}`);
    }
    res.json(payload);
  }

  public static seedCalendar(_req: Request, res: Response) {
    store.seedCalendar();
    res.json({
      message: 'Mock calendar schedule synchronized',
      totalDates: Object.keys(store.calendarEvents).length,
    });
  }

  public static addDate(req: Request, res: Response) {
    const dateValue = req.body?.date;
    if (!dateValue) {
      return res.status(400).json({ detail: 'Missing required field: date' });
    }
    const dateId = store.getOrCreateCalendarDateId(String(dateValue));
    res.json({ message: 'Date added successfully', dateId });
  }

  public static addEvent(req: Request, res: Response) {
    const { date_id, time, description, event_id } = req.body || {};
    if (!date_id || !time || !description) {
      return res.status(400).json({ detail: 'Missing required fields' });
    }
    const dateKey = store.calendarIdToDate[parseInt(date_id, 10)];
    if (!dateKey) {
      return res.status(404).json({ detail: 'date_id not found' });
    }
    const resolvedEventId = event_id || `CAL-${crypto.randomUUID().slice(0, 10)}`;
    store.calendarEvents[dateKey] = store.calendarEvents[dateKey] || [];
    if (!store.calendarEvents[dateKey].some((e) => e.eventId === resolvedEventId)) {
      store.calendarEvents[dateKey].push({
        time: String(time),
        description: String(description),
        eventId: resolvedEventId,
      });
    }
    return res.json({ message: 'Event added successfully', eventId: resolvedEventId });
  }

  public static deleteEvent(req: Request, res: Response) {
    const paramVal = req.params.event_id;
    const eventId = Array.isArray(paramVal) ? paramVal[0] : paramVal;
    let deleted = false;
    for (const [dateKey, events] of Object.entries(store.calendarEvents)) {
      const nextEvents = events.filter((e) => e.eventId !== eventId);
      if (nextEvents.length !== events.length) {
        deleted = true;
      }
      if (nextEvents.length > 0) {
        store.calendarEvents[dateKey] = nextEvents;
      } else {
        delete store.calendarEvents[dateKey];
      }
    }
    if (!deleted) {
      return res.status(404).json({ detail: 'Event not found' });
    }
    return res.json({ message: 'Event deleted successfully', success: true });
  }

  // Codes
  public static getCodeGroup(_req: Request, res: Response) {
    res.json(store.codeGroups);
  }

  public static getCode(req: Request, res: Response) {
    const groupcode = String(req.query.groupcode || '');
    res.json(store.codeDetails[groupcode] || []);
  }

  public static getSitePlaceRoom(_req: Request, res: Response) {
    res.json(store.sitePlaceRooms);
  }

  // Todos
  public static getTodos(_req: Request, res: Response) {
    res.json(store.todos);
  }

  public static addTodo(req: Request, res: Response) {
    const { title, description } = req.body || {};
    const newTodo = {
      id: store.todos.length + 1,
      title: title || 'Untitled',
      description: description || '',
      created_at: new Date().toISOString(),
    };
    store.todos.unshift(newTodo);
    res.json(newTodo);
  }

  // Bookings & Reservations
  public static getBookings(_req: Request, res: Response) {
    res.json(store.hotelBookings);
  }

  public static getReservations(_req: Request, res: Response) {
    res.json(store.medicalReservations);
  }

  // API List
  public static getApiList(_req: Request, res: Response) {
    res.json([
      { url: '/api/menu', method: 'GET', description: 'Global navigation configuration' },
      { url: '/api/members', method: 'GET', description: 'Member list for statistics and consulting' },
      { url: '/api/data', method: 'GET', description: 'Department grid dataset' },
      { url: '/db/inbound', method: 'GET', description: 'Inbound inventory dataset' },
      { url: '/db/outbound', method: 'GET', description: 'Outbound inventory dataset' },
      { url: '/api/calendar', method: 'GET', description: 'Calendar schedules' },
      { url: '/api/glos', method: 'GET', description: 'Glossary items' },
      { url: '/api/ceo-news', method: 'GET', description: 'CEO schedule & news feed' },
      { url: '/api/video-forensics/analyze', method: 'POST', description: 'AI Video Forensics inference' },
    ]);
  }
}
