import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shooter } from './entities/shooter.entity.js';
import { CreateShooterProfileDto } from './dto/create-shooter-profile.dto.js';
import { ShooterClassification } from './entities/shooter-classification.entity.js';
import { CreateShooterClassificationDto } from './dto/create-shooter-classification.dto.js';
import { UpdateShooterClassificationDto } from './dto/update-shooter-classification.dto.js';

@Injectable()
export class ShootersService {
  constructor(
    @InjectRepository(Shooter)
    private readonly shootersRepository: Repository<Shooter>,
    @InjectRepository(ShooterClassification)
    private readonly classificationsRepository: Repository<ShooterClassification>,
  ) {}

  /**
   * Create or Update shooter profile for the current user
   */
  async createOrUpdateProfile(
    user: { id: number },
    createDto: CreateShooterProfileDto,
  ): Promise<Shooter> {
    let shooter = await this.shootersRepository.findOne({
      where: { user_id: user.id },
    });

    if (shooter) {
      // Update existing
      this.shootersRepository.merge(shooter, createDto);
    } else {
      // Create new
      // We need to handle 'shooter_id' generation.
      // In a real app, strict generation logic is needed.
      // Here we rely on the DB trigger or generate one manually if trigger isn't reliable in TypeORM save.
      // However, the DB has a trigger `set_shooter_id` BEFORE INSERT.
      // So we can just save it.
      // Note: user_id is required.
      shooter = this.shootersRepository.create({
        ...createDto,
        user_id: user.id,
        profile_complete: true,
      });
    }

    return this.shootersRepository.save(shooter);
  }

  /**
   * Get public profile by shooter ID (e.g. PSCI-1001) or User ID
   */
  async findOne(id: number): Promise<Shooter> {
    const shooter = await this.shootersRepository.findOne({
      where: { id },
      relations: ['user', 'state_association'],
    });

    if (!shooter) {
      throw new NotFoundException(`Shooter not found`);
    }

    return shooter;
  }

  /**
   * Get profile by User ID
   */
  async findByUserId(userId: number): Promise<Shooter> {
    const shooter = await this.shootersRepository.findOne({
      where: { user_id: userId },
      relations: ['state_association'],
    });

    if (!shooter) {
      throw new NotFoundException('Shooter profile not found');
    }
    return shooter;
  }

  /**
   * Admin: Verify a shooter
   */
  async verifyShooter(id: number, adminId: number): Promise<Shooter> {
    const shooter = await this.findOne(id);
    shooter.verified_at = new Date();
    shooter.verified_by = adminId;
    return this.shootersRepository.save(shooter);
  }

  /**
   * Add a new classification to a shooter
   */
  async addClassification(
    shooterId: number,
    dto: CreateShooterClassificationDto,
  ): Promise<ShooterClassification> {
    await this.findOne(shooterId); // Ensure shooter exists

    // Deactivate previous active classifications for this shooter
    await this.classificationsRepository.update(
      { shooter_id: shooterId, is_current: true },
      { is_current: false },
    );

    const classification = this.classificationsRepository.create({
      ...dto,
      shooter_id: shooterId,
      is_current: true,
    });

    return this.classificationsRepository.save(classification);
  }

  /**
   * Update a classification
   */
  async updateClassification(
    id: number,
    dto: UpdateShooterClassificationDto,
  ): Promise<ShooterClassification> {
    const classification = await this.classificationsRepository.findOne({
      where: { id },
    });
    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    this.classificationsRepository.merge(classification, dto);
    return this.classificationsRepository.save(classification);
  }

  /**
   * Get classifications for a shooter
   */
  async getClassifications(
    shooterId: number,
  ): Promise<ShooterClassification[]> {
    return this.classificationsRepository.find({
      where: { shooter_id: shooterId },
      order: { created_at: 'DESC' },
      relations: ['disability_category'],
    });
  }
}
