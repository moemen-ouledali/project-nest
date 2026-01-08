import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: MongoRepository<Event>,
  ) {}

  async creatEvent(dto: CreateEventDto) {
    const capacity = Number(dto.capacity);
    if (capacity <= 0) {
      throw new BadRequestException('capacity doit etre strict superieure à 0');
    }

    const eventDate = new Date(dto.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      throw new BadRequestException(
        "la date ne doit pas être antérieure à la date actuelle du systeme",
      );
    }

    const event = this.eventRepository.create(dto);
    return this.eventRepository.save(event);
  }

  async showEvent() {
    return this.eventRepository.find();
  }

  async showEventById(id: string) {
    const event = await this.eventRepository.findOne({
      where: { _id: id, available: true },
    });

    if (!event) {
      throw new NotFoundException("event n'existe pas ou n'est pas disponible");
    }

    return event;
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({
      where: { _id: id },
    });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    if (dto.capacity !== undefined && dto.capacity <= 0) {
      throw new BadRequestException(
        'capacity doit etre strictement superieure à 0',
      );
    }

    if (dto.date) {
      const eventDate = new Date(dto.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        throw new BadRequestException(
          "la date ne doit pas être antérieure à la date actuelle du systeme",
        );
      }
    }

    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async deleteEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: { _id: id },
    });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    await this.eventRepository.delete(id);
    return { message: 'event supprimé avec succès' };
  }
}
