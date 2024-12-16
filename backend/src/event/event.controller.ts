import {Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe} from '@nestjs/common';
  import { EventService } from './event.service';
  import { CreateEventDto } from 'src/event/dto/event.dto';
  import { UpdateEventDto } from 'src/event/dto/update_dto.dto';
  import { AuthGuard } from 'src/authentification/auth.guard';
  import { CurrentUser } from 'src/authentification/user.decorator';
  
  @Controller('events')
  @UseGuards(AuthGuard)
  export class EventController {
    constructor(private readonly eventService: EventService) {}
  
    @Get()
    async findAll(@CurrentUser() user: any) {
      return this.eventService.findAll(user.id);
    }
  
    @Get(':id')
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @CurrentUser() user: any,
    ) {
      return this.eventService.findOne(id, user.id);
    }
  
    @Post()
    async create(
      @Body() createEventDto: CreateEventDto,
      @CurrentUser() user: any,
    ) {
      return this.eventService.create(user.id, createEventDto);
    }
  
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateEventDto: UpdateEventDto,
      @CurrentUser() user: any,
    ) {
      return this.eventService.update(id, user.id, updateEventDto);
    }
  
    @Delete(':id')
    async delete(
      @Param('id', ParseIntPipe) id: number,
      @CurrentUser() user: any,
    ) {
      await this.eventService.delete(id, user.id);
    }
  }