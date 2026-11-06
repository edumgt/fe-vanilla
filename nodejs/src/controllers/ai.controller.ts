import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';

const store = StoreService.getInstance();

export class AiController {
  // Glossary (glos.html)
  public static getGlos(_req: Request, res: Response) {
    res.json(store.glossaryRows);
  }

  public static setGlos(req: Request, res: Response) {
    const payload = req.body || {};
    const maxId = store.glossaryRows.reduce((acc, row) => Math.max(acc, row.id || 0), 0);
    const nextId = maxId + 1;
    const newRow = {
      id: nextId,
      en: payload.en || '',
      ko: payload.ko || '',
      desc: payload.desc || '',
      img: payload.img || '',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    store.glossaryRows.unshift(newRow);
    res.json({ success: true, message: 'New row inserted', id: nextId });
  }

  public static updateGlos(req: Request, res: Response) {
    const itemParam = req.params.item_id;
    const itemId = parseInt(Array.isArray(itemParam) ? itemParam[0] : itemParam, 10);
    const row = store.glossaryRows.find((r) => r.id === itemId);
    if (!row) {
      return res.status(404).json({ detail: 'No row updated' });
    }
    const payload = req.body || {};
    if (payload.en !== undefined) row.en = payload.en;
    if (payload.ko !== undefined) row.ko = payload.ko;
    if (payload.desc !== undefined) row.desc = payload.desc;
    if (payload.img !== undefined) row.img = payload.img;
    return res.json({ success: true, message: 'Row updated successfully' });
  }

  public static deleteGlos(req: Request, res: Response) {
    const { ids } = req.body || {};
    if (!Array.isArray(ids)) {
      // Check param if single item
      const itemParam = req.params.item_id;
      if (itemParam) {
        const idVal = parseInt(Array.isArray(itemParam) ? itemParam[0] : itemParam, 10);
        store.glossaryRows = store.glossaryRows.filter((r) => r.id !== idVal);
        return res.json({ success: true, message: 'Row deleted' });
      }
      return res.status(400).json({ detail: 'ids must be an array' });
    }
    const set = new Set(ids.map((id) => parseInt(id, 10)));
    const before = store.glossaryRows.length;
    store.glossaryRows = store.glossaryRows.filter((r) => !set.has(r.id));
    const deletedCount = before - store.glossaryRows.length;
    return res.json({ success: true, message: `${deletedCount} rows deleted` });
  }

  public static addGlosReq(req: Request, res: Response) {
    const { glos_id, req_msg } = req.body || {};
    if (!glos_id || !req_msg) {
      return res.status(400).json({ detail: 'Missing fields' });
    }
    const insertId = store.glossaryRequests.length + 1;
    store.glossaryRequests.push({
      id: insertId,
      glos_id: parseInt(glos_id, 10),
      req_msg: String(req_msg),
      req_date: new Date().toISOString().slice(0, 10),
    });
    return res.json({
      success: true,
      message: 'Glossary correction request stored',
      insertId,
    });
  }

  public static getGlosReq(req: Request, res: Response) {
    const glosId = parseInt(String(req.query.glos_id || 0), 10);
    const matches = store.glossaryRequests.filter((r) => r.glos_id === glosId);
    res.json(matches);
  }

  // CEO News & Schedule
  public static getCeoNews(req: Request, res: Response) {
    const ticker = String(req.query.ticker || 'NVDA').toUpperCase();
    const CEO_NEWS_DATA: Record<string, any[]> = {
      NVDA: [
        { title: 'Jensen Huang visits Japan, meets SoftBank CEO Masayoshi Son', date: '2025-06-03', time: '09:00', summary: 'NVIDIA CEO Jensen Huang traveled to Tokyo for strategic AI partnership talks with SoftBank.', source: 'Reuters', link: '#', country: '일본' },
        { title: 'Jensen Huang keynote at COMPUTEX 2025 in Taipei', date: '2025-05-20', time: '14:00', summary: 'NVIDIA CEO unveiled Blackwell Ultra GPU and new NIM microservices platform.', source: 'TechCrunch', link: '#', country: '대만' },
        { title: 'Jensen Huang visits South Korea, meets Samsung and SK Hynix executives', date: '2025-04-10', time: '09:30', summary: 'NVIDIA CEO traveled to Seoul to discuss HBM memory supply agreements.', source: 'Korea Herald', link: '#', country: '한국' },
        { title: 'NVIDIA GTC 2025: Jensen Huang unveils Rubin GPU architecture', date: '2025-03-18', time: '13:00', summary: 'Jensen Huang announced the Rubin architecture successor to Blackwell.', source: 'The Verge', link: '#', country: '미국' },
      ],
      MSFT: [
        { title: 'Satya Nadella visits India, announces $3B AI investment in Azure', date: '2025-06-05', time: '10:00', summary: 'Microsoft CEO Satya Nadella announced $3 billion investment in India AI data centers.', source: 'Bloomberg', link: '#', country: '인도' },
        { title: 'Nadella keynotes Microsoft Build 2025, unveils Copilot+ enterprise suite', date: '2025-05-19', time: '09:00', summary: 'Satya Nadella opened Build 2025 announcing new Copilot+ enterprise AI capabilities.', source: 'TechCrunch', link: '#', country: '미국' },
      ],
      GOOGL: [
        { title: 'Sundar Pichai at Google I/O 2025: Gemini 2.0 Ultra released', date: '2025-05-14', time: '10:00', summary: 'Google CEO Sundar Pichai unveiled Gemini 2.0 Ultra at Google I/O.', source: 'The Verge', link: '#', country: '미국' },
        { title: 'Pichai visits Seoul, meets Korean AI startup leaders and Samsung executives', date: '2025-04-22', time: '10:00', summary: 'Google CEO Sundar Pichai traveled to Seoul for Korea AI Summit.', source: 'Korea JoongAng Daily', link: '#', country: '한국' },
      ],
    };
    const articles = CEO_NEWS_DATA[ticker] || CEO_NEWS_DATA.NVDA;
    res.json({ ticker, articles });
  }

  // AI Video Forensic Simulation / Proxy (video-ai.html)
  public static analyzeVideo(_req: Request, res: Response) {
    res.json({
      success: true,
      verdict: 'AI 생성 가능성 높음',
      tone: 'ai',
      badge: 'AI 우세',
      summary: '질감이 매우 균일하고 반사광 패턴이 강해 생성형 또는 렌더링 기반 영상으로 추정됩니다.',
      aiProbability: 0.55,
      confidence: 0.60,
      averageFrameScore: 0.52,
      frameAverages: { temporalDelta: 0.14 },
      highlights: [
        { label: '쇼트폼 길이 패턴', score: 0.72, detail: '짧은 데모형 클립은 생성형 샘플 비중이 높아 보조 신호로 반영합니다.' },
        { label: '미세 질감 균일성', score: 0.51, detail: '센서 노이즈와 피부/재질의 미세 결이 약하게 나타나면 생성형 영상으로 가중합니다.' }
      ],
      indicators: [
        { label: '미세 질감 균일성', score: 0.51, description: '센서 노이즈와 피부 결의 미세 변화가 약한 수준입니다.' },
        { label: '하이라이트 / 네온 반사', score: 0.61, description: '강한 반사광과 채도가 생성형 합성 패턴에 부합합니다.' }
      ],
      frameSeries: [
        { label: '0.4s', score: 0.58 },
        { label: '1.0s', score: 0.54 },
        { label: '1.6s', score: 0.51 },
        { label: '2.2s', score: 0.49 },
        { label: '2.8s', score: 0.55 },
        { label: '3.4s', score: 0.57 },
        { label: '4.0s', score: 0.50 },
        { label: '4.6s', score: 0.48 }
      ]
    });
  }
}
