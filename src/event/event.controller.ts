import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('creatEvent')
  creatEvent(@Body() dto: CreateEventDto) {
    return this.eventService.creatEvent(dto);
  }

  @Get('showEvent')
  showEvent() {
    return this.eventService.showEvent();
  }

  @Get('showEvent/:id')
  showEventById(@Param('id') id: string) {
    return this.eventService.showEventById(id);
  }

  @Put('UpdateEvent/:id')
  updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.updateEvent(id, dto);
  }

  @Delete('DeleteEvent/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  @Get('reservationEvent/:id')
  reservationEvent(@Param('id') id: string) {
    return this.eventService.reservationEvent(id);
  }
}