import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
