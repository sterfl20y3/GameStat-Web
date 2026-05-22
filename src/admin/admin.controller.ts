import { Controller, Get, Post, Delete, Body, Param, Query, Req, Res, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard, AdminGuard } from '../common/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const stats = await this.adminService.getDashboardStats();
    const logsData = await this.adminService.getLogs(1, 10);
    return res.render('admin/dashboard', {
      title: 'Адмін-панель — GameStat',
      user: req['user'],
      stats,
      logs: logsData.logs,
    });
  }

  @Get('users')
  async users(@Req() req: Request, @Res() res: Response) {
    const users = await this.adminService.getUsers();
    return res.render('admin/users', { title: 'Управління користувачами', user: req['user'], users });
  }

  @Post('users/:id/role')
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Res() res: Response) {
    await this.adminService.updateUserRole(id, body.role);
    return res.redirect('/admin/users');
  }

  @Post('users/:id/delete')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.adminService.deleteUser(id);
    return res.redirect('/admin/users');
  }

  @Get('players')
  async players(@Query('page') page = '1', @Req() req: Request, @Res() res: Response) {
    const data = await this.adminService.getPlayers(+page);
    return res.render('admin/players', { title: 'Управління гравцями', user: req['user'], ...data });
  }

  @Post('players/:id/delete')
  async deletePlayer(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.adminService.deletePlayer(id);
    return res.redirect('/admin/players');
  }

  @Get('meta')
  async meta(@Req() req: Request, @Res() res: Response) {
    const stats = await this.adminService.getMetaStats();
    return res.render('admin/meta', { title: 'Мета-статистика (Admin)', user: req['user'], stats });
  }

  @Post('meta')
  async createMeta(@Body() body: any, @Res() res: Response) {
    await this.adminService.createMetaStat({
      entityName: body.entityName,
      entityType: body.entityType,
      winrate: parseFloat(body.winrate),
      popularity: parseFloat(body.popularity),
      avgDamage: parseFloat(body.avgDamage),
      region: body.region || 'global',
    });
    return res.redirect('/admin/meta');
  }

  @Post('meta/:id/update')
  async updateMeta(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Res() res: Response) {
    await this.adminService.updateMetaStat(id, {
      entityName: body.entityName,
      entityType: body.entityType,
      winrate: parseFloat(body.winrate),
      popularity: parseFloat(body.popularity),
      avgDamage: parseFloat(body.avgDamage),
    });
    return res.redirect('/admin/meta');
  }

  @Post('meta/:id/delete')
  async deleteMeta(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.adminService.deleteMetaStat(id);
    return res.redirect('/admin/meta');
  }

  @Get('logs')
  async logs(@Query('page') page = '1', @Req() req: Request, @Res() res: Response) {
    const data = await this.adminService.getLogs(+page);
    return res.render('admin/logs', { title: 'Логи активності', user: req['user'], ...data });
  }
}
