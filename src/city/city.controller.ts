import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Roles } from 'src/user/decorators/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { CityService } from './city.service';
import { CityEntity } from './entity/city.entity';

@ApiTags('Cities flow')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @ApiOkResponse({ type: [CityEntity], description: 'Find all cities' })
  @Get('all')
  async getAllCities() {
    return await this.cityService.getAllCities();
  }

  @ApiOperation({ summary: 'Get all regional center' })
  @ApiOkResponse({
    type: [CityEntity],
    description: 'Find all regional center',
  })
  @Get('regional')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(RoleGuard)
  async getRegionalCities() {
    return await this.cityService.getRegionalCities();
  }
}
