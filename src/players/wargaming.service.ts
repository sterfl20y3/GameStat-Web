import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WargamingService {
  private readonly logger = new Logger(WargamingService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private config: ConfigService) {
    this.apiKey = config.get('WARGAMING_API_KEY', '');
    this.apiUrl = config.get('WARGAMING_API_URL', 'https://api.worldoftanks.eu/wot');
  }

  async searchPlayer(nickname: string, region = 'eu'): Promise<any | null> {
    if (!this.apiKey) {
      return this.mockPlayerData(nickname, region);
    }

    try {
      const url = `${this.apiUrl}/account/list/`;
      const resp = await axios.get(url, {
        params: { application_id: this.apiKey, search: nickname, type: 'exact' },
        timeout: 5000,
      });

      if (resp.data.status !== 'ok' || !resp.data.data?.length) return null;

      const acc = resp.data.data[0];
      const statsResp = await axios.get(`${this.apiUrl}/account/info/`, {
        params: { application_id: this.apiKey, account_id: acc.account_id },
        timeout: 5000,
      });

      const statsData = statsResp.data.data?.[acc.account_id];
      if (!statsData) return null;

      const s = statsData.statistics?.all || {};
      const battles = s.battles || 0;
      const wins = s.wins || 0;

      return {
        accountId: String(acc.account_id),
        nickname: acc.nickname,
        region,
        battles,
        wins,
        losses: battles - wins,
        winrate: battles > 0 ? (wins / battles) * 100 : 0,
        avgDamage: battles > 0 ? (s.damage_dealt || 0) / battles : 0,
        avgXp: battles > 0 ? (s.xp || 0) / battles : 0,
        kills: s.frags || 0,
        survivalRate: battles > 0 ? ((s.survived_battles || 0) / battles) * 100 : 0,
        wn8: this.calculateWN8(s),
      };
    } catch (err) {
      this.logger.warn(`API error for ${nickname}: ${err.message}`);
      return this.mockPlayerData(nickname, region);
    }
  }

  private calculateWN8(s: any): number {
    const battles = s.battles || 1;
    const winrate = (s.wins || 0) / battles;
    const avgDmg = (s.damage_dealt || 0) / battles;
    // Simplified WN8
    return Math.floor(winrate * 3000 + avgDmg * 0.5);
  }

  private mockPlayerData(nickname: string, region: string) {
    const seed = nickname.length * 137;
    const battles = 1000 + (seed % 20000);
    const winrate = 45 + (seed % 30);
    const wins = Math.floor(battles * winrate / 100);
    const avgDamage = 800 + (seed % 2500);

    return {
      accountId: `MOCK_${seed}`,
      nickname,
      region,
      battles,
      wins,
      losses: battles - wins,
      winrate: parseFloat(winrate.toFixed(2)),
      avgDamage: parseFloat(avgDamage.toFixed(0)),
      avgXp: parseFloat((avgDamage * 0.4).toFixed(0)),
      kills: Math.floor(battles * 1.2),
      survivalRate: parseFloat((winrate * 0.65).toFixed(2)),
      wn8: parseFloat((winrate * 40 + avgDamage * 0.3).toFixed(0)),
    };
  }
}
