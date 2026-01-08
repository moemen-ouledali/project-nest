import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: MongoRepository<Event>,
  ) {}

  private toObjectId(id: string) {
    try {
      return new ObjectId(id);
    } catch {
      throw new BadRequestException('id invalide');
    }
  }

  async creatEvent(dto: CreateEventDto) {
    if (dto.capacity <= 0) {
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
    const _id = this.toObjectId(id);

    const event = await this.eventRepository.findOne({
      where: { _id, available: true },
    });

    if (!event) {
      throw new NotFoundException("event n'existe pas ou n'est pas disponible");
    }

    return event;
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const _id = this.toObjectId(id);

    const event = await this.eventRepository.findOne({ where: { _id } });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async deleteEvent(id: string) {
    const _id = this.toObjectId(id);

    const event = await this.eventRepository.findOne({ where: { _id } });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    await this.eventRepository.delete(_id);
    return { message: 'event supprimé avec succès' };
  }

  async reservationEvent(id: string) {
    const _id = this.toObjectId(id);

    const event = await this.eventRepository.findOne({ where: { _id } });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    if (!event.available || event.capacity <= 0) {
      throw new BadRequestException("event n'est plus disponible");
    }

    event.capacity -= 1;

    if (event.capacity === 0) {
      event.available = false;
    }

    return this.eventRepository.save(event);
  }

  async searchEvent(name?: string, category?: string) {
    const query: any = {};
    if (name) query.name = name;
    if (category) query.category = category;

    const events = await this.eventRepository.find({ where: query });

    if (events.length === 0) {
      throw new NotFoundException('aucun event trouvé');
    }

    return events;
  }

  async calculateAverageCapacity() {
    const events = await this.eventRepository.find({
      where: { available: true },
    });

    if (events.length === 0) {
      throw new NotFoundException('aucun event disponible');
    }

    const totalCapacity = events.reduce(
      (sum, event) => sum + event.capacity,
      0,
    );

    return { averageCapacity: totalCapacity / events.length };
  }

  async increaseCapacity(id: string, available: boolean) {
    const _id = this.toObjectId(id);

    const event = await this.eventRepository.findOne({ where: { _id } });

    if (!event) {
      throw new NotFoundException("event n'existe pas");
    }

    if (!available || !event.available) {
      throw new BadRequestException("event n'est pas disponible");
    }

    event.capacity = Math.ceil(event.capacity * 1.1);
    return this.eventRepository.save(event);
  }
}
