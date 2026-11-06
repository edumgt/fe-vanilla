import { Router } from 'express';
import { GeneralController } from '../controllers/general.controller.js';

export const generalRouter = Router();

// Menu & Permissions
generalRouter.get('/api/menu', GeneralController.getMenu);
generalRouter.get('/api/members', GeneralController.getMembers);
generalRouter.get('/api/permissions', GeneralController.getPermissions);

// Department Grid Data
generalRouter.get('/api/data', GeneralController.getData);
generalRouter.post('/api/save', GeneralController.saveData);
generalRouter.post('/api/delete', GeneralController.deleteData);

// WMS Inventory
generalRouter.get('/db/inbound', GeneralController.getInbound);
generalRouter.get('/db/outbound', GeneralController.getOutbound);
generalRouter.post('/db/inbound/add', GeneralController.addInbound);
generalRouter.post('/db/outbound/add', GeneralController.addOutbound);
generalRouter.post('/db/inbound/update', GeneralController.updateInbound);
generalRouter.post('/db/outbound/update', GeneralController.updateOutbound);
generalRouter.post('/db/inbound/delete', GeneralController.deleteInbound);
generalRouter.post('/db/outbound/delete', GeneralController.deleteOutbound);

// Dynamic Connect & Query
generalRouter.post('/db/dynamicConnect', GeneralController.dynamicConnect);
generalRouter.post('/db/query', GeneralController.executeQuery);

// Calendar
generalRouter.get('/api/calendar', GeneralController.getCalendar);
generalRouter.post('/api/calendar/mock-seed', GeneralController.seedCalendar);
generalRouter.post('/api/addDate', GeneralController.addDate);
generalRouter.post('/api/addEvent', GeneralController.addEvent);
generalRouter.delete('/api/deleteEvent/:event_id', GeneralController.deleteEvent);

// Code Groups & Site Rooms
generalRouter.get('/api/codegroup', GeneralController.getCodeGroup);
generalRouter.get('/api/code', GeneralController.getCode);
generalRouter.get('/api/SitePlaceRoom', GeneralController.getSitePlaceRoom);

// Todos
generalRouter.get('/api/todos', GeneralController.getTodos);
generalRouter.post('/api/todos', GeneralController.addTodo);

// Bookings & Reservations
generalRouter.get('/api/bookings', GeneralController.getBookings);
generalRouter.get('/api/reservations', GeneralController.getReservations);

// API Documentation & List
generalRouter.get('/api/list', GeneralController.getApiList);
