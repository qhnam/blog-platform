import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ErrorException } from './error.exception';
import { ERROR_CODE } from '../enum/error-code.enum';

type Payload = {
  name: string;
  constraints: Record<string, string> | null;
  children: Payload[] | null;
};

@Injectable()
export class CustomPipeValidationException implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const payload: Payload[] = [];

      errors.forEach((error) => {
        if (error.children?.length) {
          payload.push({
            children: this.validateChildren(error.children),
            constraints: null,
            name: error.property,
          });
        }

        if (error.constraints) {
          payload.push({
            name: error.property,
            children: null,
            constraints: error.constraints,
          });
        }
      });
      throw new ErrorException(
        ERROR_CODE.VALIDATION_ERROR,
        'Validation error.',
        payload,
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private validateChildren(errors: ValidationError[]): Payload[] {
    const payload: Payload[] = [];
    errors.forEach((error) => {
      if (error.children?.length) {
        payload.push(...this.validateChildren(error.children));
      }

      if (error.constraints) {
        payload.push({
          name: error.property,
          constraints: error.constraints,
          children: null,
        });
      }
    });

    return payload;
  }
}
