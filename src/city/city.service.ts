import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entity/city.entity';
import { NOT_FOUND_CITY } from './errors/errors';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findOneById(id: string) {
    const city = await this.cityRepository
      .createQueryBuilder('city')
      .where('city.id = :cityId', { cityId: id })
      .getOne();

    if (!city) {
      throw new NotFoundException(NOT_FOUND_CITY);
    }
  }

  async getAllCities() {
    // const DATA = [
    //   {
    //     Description: 'Абазівка (Полтавський р-н, Полтавська обл)',
    //     DescriptionRu: 'Абазовка (Полтавский р-н, Полтавская обл)',
    //     Ref: 'fc5f1e3c-928e-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508137-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '2667',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Полтавська',
    //     AreaDescriptionRu: 'Полтавская',
    //   },
    //   {
    //     Description: 'Абранка',
    //     DescriptionRu: 'Абранка',
    //     Ref: '1b009444-4e4a-11ed-a361-48df37b92096',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812e-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '9809',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Закарпатська',
    //     AreaDescriptionRu: 'Закарпатская',
    //   },
    //   {
    //     Description: 'Абрикосівка',
    //     DescriptionRu: 'Абрикосовка',
    //     Ref: '6dbe932e-1aad-11ea-8c15-0025b502a06e',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '5012',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Херсонська',
    //     AreaDescriptionRu: 'Херсонская',
    //   },
    //   {
    //     Description: 'Авангард',
    //     DescriptionRu: 'Авангард',
    //     Ref: '8e1718f5-1972-11e5-add9-005056887b8d',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '71508136-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced11-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '1042',
    //     SettlementTypeDescription: 'селище міського типу',
    //     SettlementTypeDescriptionRu: 'поселок городского типа',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Одеська',
    //     AreaDescriptionRu: 'Одесская',
    //   },
    //   {
    //     Description: 'Августинівка',
    //     DescriptionRu: 'Августиновка',
    //     Ref: '93edc540-9e41-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '7150812f-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '2868',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Запорізька',
    //     AreaDescriptionRu: 'Запорожская',
    //   },
    //   {
    //     Description: 'Августівка',
    //     DescriptionRu: 'Августовка',
    //     Ref: '9523ea02-7302-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508136-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '1734',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Одеська',
    //     AreaDescriptionRu: 'Одесская',
    //   },
    //   {
    //     Description: 'Авдіївка (Донецька обл.)',
    //     DescriptionRu: 'Авдеевка (Донецкая обл.)',
    //     Ref: 'a9522a7e-eaf5-11e7-ba66-005056b2fc3d',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '7150812c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced10-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '1337',
    //     SettlementTypeDescription: 'місто',
    //     SettlementTypeDescriptionRu: 'город',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Донецька',
    //     AreaDescriptionRu: 'Донецкая',
    //   },
    //   {
    //     Description: 'Авдіївка (Сосницький р-н., Чернігівська обл.)',
    //     DescriptionRu: 'Авдеевка (Сосницкий р-н., Черниговская обл.)',
    //     Ref: 'e3f238f7-5a94-11e9-a703-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508140-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '1550',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Чернігівська',
    //     AreaDescriptionRu: 'Черниговская',
    //   },
    //   {
    //     Description: 'Авіамістечко',
    //     DescriptionRu: 'Авиагородок',
    //     Ref: '0c134e58-1ab1-11ea-8c15-0025b502a06e',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812f-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced10-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '5052',
    //     SettlementTypeDescription: 'місто',
    //     SettlementTypeDescriptionRu: 'город',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Запорізька',
    //     AreaDescriptionRu: 'Запорожская',
    //   },
    //   {
    //     Description: 'Авіаторське',
    //     DescriptionRu: 'Авиаторское',
    //     Ref: 'd30a9675-7404-11e5-8d8d-005056887b8d',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '1',
    //     Area: '7150812b-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced11-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '1140',
    //     SettlementTypeDescription: 'селище міського типу',
    //     SettlementTypeDescriptionRu: 'поселок городского типа',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Дніпропетровська',
    //     AreaDescriptionRu: 'Днепропетровская',
    //   },
    //   {
    //     Description: 'Аврамівка',
    //     DescriptionRu: 'Аврамовка',
    //     Ref: 'ae14ae5b-b77a-11e9-8c22-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813e-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '3364',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Черкаська',
    //     AreaDescriptionRu: 'Черкасская',
    //   },
    //   {
    //     Description: 'Агаймани',
    //     DescriptionRu: 'Агайманы',
    //     Ref: 'f384f3bf-b7a7-11e9-8c22-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '3613',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Херсонська',
    //     AreaDescriptionRu: 'Херсонская',
    //   },
    //   {
    //     Description: 'Агробаза (Донецька обл.)',
    //     DescriptionRu: 'Агробаза (Донецкая обл.)',
    //     Ref: '18ab598b-ec59-11ea-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '6240',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Донецька',
    //     AreaDescriptionRu: 'Донецкая',
    //   },
    //   {
    //     Description: 'Агрономічне',
    //     DescriptionRu: 'Агрономичное',
    //     Ref: 'ebc0eda9-93ec-11e3-b441-0050568002cf',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '1',
    //     Area: '71508129-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '890',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Вінницька',
    //     AreaDescriptionRu: 'Винницкая ',
    //   },
    //   {
    //     Description: 'Агрономія',
    //     DescriptionRu: 'Агрономия',
    //     Ref: 'f17dc676-cf44-11e9-b0c5-005056b24375',
    //     Delivery1: '0',
    //     Delivery2: '1',
    //     Delivery3: '0',
    //     Delivery4: '1',
    //     Delivery5: '0',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '71508135-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '4150',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Миколаївська',
    //     AreaDescriptionRu: 'Николаевская',
    //   },
    //   {
    //     Description: 'Адамівка (Рівненська обл.)',
    //     DescriptionRu: 'Адамовка (Ровенская обл.)',
    //     Ref: 'e0d51b7b-be49-11eb-80fb-b8830365bd04',
    //     Delivery1: '0',
    //     Delivery2: '1',
    //     Delivery3: '0',
    //     Delivery4: '1',
    //     Delivery5: '0',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '71508138-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '7892',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Рівненська',
    //     AreaDescriptionRu: 'Ровенская',
    //   },
    //   {
    //     Description: 'Адамівка (Хмельницька обл.)',
    //     DescriptionRu: 'Адамовка (Хмельницкая обл.)',
    //     Ref: '38861002-de39-11ea-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813d-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '6085',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Хмельницька',
    //     AreaDescriptionRu: 'Хмельницкая',
    //   },
    //   {
    //     Description: 'Адампіль',
    //     DescriptionRu: 'Адамполь',
    //     Ref: '67094bdd-9e45-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813d-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '2889',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Хмельницька',
    //     AreaDescriptionRu: 'Хмельницкая',
    //   },
    //   {
    //     Description: 'Аджамка',
    //     DescriptionRu: 'Аджамка',
    //     Ref: 'cc4ca497-d3ce-11e5-8478-005056887b8d',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508132-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '1188',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Кіровоградська',
    //     AreaDescriptionRu: 'Кировоградская',
    //   },
    //   {
    //     Description: 'Азов',
    //     DescriptionRu: 'Азов',
    //     Ref: '3b12367b-3e3d-11eb-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812f-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '7155',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Запорізька',
    //     AreaDescriptionRu: 'Запорожская',
    //   },
    //   {
    //     Description: 'Азовське',
    //     DescriptionRu: 'Азовское',
    //     Ref: 'c1079228-76f9-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '1944',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Херсонська',
    //     AreaDescriptionRu: 'Херсонская',
    //   },
    //   {
    //     Description: 'Азовське (Запорізька обл.)',
    //     DescriptionRu: 'Азовское (Запорожская обл.)',
    //     Ref: 'd30282f8-feee-11e9-91ff-0025b501a04b',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812f-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '5505',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Запорізька',
    //     AreaDescriptionRu: 'Запорожская',
    //   },
    //   {
    //     Description: 'Азовське (Першотравневий р-н)',
    //     DescriptionRu: 'Азовское (Первомайский р-н)',
    //     Ref: '08c5b1e0-5f64-11ec-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812c-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '9084',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Донецька',
    //     AreaDescriptionRu: 'Донецкая',
    //   },
    //   {
    //     Description: 'Айдар-Миколаївка',
    //     DescriptionRu: 'Айдар-Николаевка',
    //     Ref: 'db35af88-4631-11ec-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '0',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '71508133-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '8599',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Луганська',
    //     AreaDescriptionRu: 'Луганская',
    //   },
    //   {
    //     Description: 'Акрешори',
    //     DescriptionRu: 'Акрешоры',
    //     Ref: '27da2be0-7147-11eb-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508130-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '7406',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Івано-Франківська',
    //     AreaDescriptionRu: 'Ивано-Франковская',
    //   },
    //   {
    //     Description: 'Алтестове',
    //     DescriptionRu: 'Алтестово',
    //     Ref: '1ae5baed-1a1b-11eb-80fb-b8830365bd04',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '0',
    //     Area: '71508136-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '6721',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Одеська',
    //     AreaDescriptionRu: 'Одесская',
    //   },
    //   {
    //     Description: 'Алтинівка',
    //     DescriptionRu: 'Алтыновка',
    //     Ref: 'b7b9cd41-aa02-11e9-b73a-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508139-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '3289',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Сумська',
    //     AreaDescriptionRu: 'Сумская',
    //   },
    //   {
    //     Description: 'Ананьїв',
    //     DescriptionRu: 'Ананьев',
    //     Ref: '06f8796e-4079-11de-b509-001d92f78698',
    //     Delivery1: '1',
    //     Delivery2: '1',
    //     Delivery3: '1',
    //     Delivery4: '1',
    //     Delivery5: '1',
    //     Delivery6: '1',
    //     Delivery7: '1',
    //     Area: '71508136-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced10-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '197',
    //     SettlementTypeDescription: 'місто',
    //     SettlementTypeDescriptionRu: 'город',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Одеська',
    //     AreaDescriptionRu: 'Одесская',
    //   },
    //   {
    //     Description: 'Ангелівка',
    //     DescriptionRu: 'Ангеловка (Тернопольская обл.)',
    //     Ref: '72467cf8-a0fd-11ea-a970-b8830365ade4',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150813a-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '5711',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Тернопільська',
    //     AreaDescriptionRu: 'Тернопольская',
    //   },
    //   {
    //     Description: 'Ангелінівка',
    //     DescriptionRu: 'Ангелиновка',
    //     Ref: 'd4f405a2-64d0-11e9-898c-005056b24375',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '71508136-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '0',
    //     CityID: '1643',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Одеська',
    //     AreaDescriptionRu: 'Одесская',
    //   },
    //   {
    //     Description: 'Андрівка (Запорізька обл.)',
    //     DescriptionRu: 'Андровка (Запорожская обл.)',
    //     Ref: '33656c5a-0c9a-11ea-8c15-0025b502a06e',
    //     Delivery1: '1',
    //     Delivery2: '0',
    //     Delivery3: '1',
    //     Delivery4: '0',
    //     Delivery5: '1',
    //     Delivery6: '0',
    //     Delivery7: '0',
    //     Area: '7150812f-9b87-11de-822f-000c2965ae0e',
    //     SettlementType: '563ced13-f210-11e3-8c4a-0050568002cf',
    //     IsBranch: '0',
    //     PreventEntryNewStreetsUser: '1',
    //     CityID: '5651',
    //     SettlementTypeDescription: 'село',
    //     SettlementTypeDescriptionRu: 'село',
    //     SpecialCashCheck: 1,
    //     AreaDescription: 'Запорізька',
    //     AreaDescriptionRu: 'Запорожская',
    //   },
    // ];

    // const cities = DATA.filter(
    //   (city) => city.SettlementTypeDescription !== 'село',
    // );

    // for (let i = 0; i < cities.length; i++) {
    //   const newCity = new CityEntity();
    //   newCity.name = cities[i].Description;
    //   newCity.area = cities[i].AreaDescription;
    //   await this.cityRepository.save(newCity);
    // }
    const queryBuilder = this.cityRepository
      .createQueryBuilder('city')
      .orderBy('city.name', 'ASC');

    return await queryBuilder.getMany();
  }
}
