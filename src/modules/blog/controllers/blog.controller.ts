import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {}
