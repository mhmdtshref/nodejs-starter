import { ModelValidateOptions } from "sequelize";

const stringValidateObject = (fieldName: string, nullable: boolean, len?: { min: number, max: number }): ModelValidateOptions => {
    const validator: ModelValidateOptions = {};
    if (len) {
        validator.len = {
            msg: `${fieldName} length should be greater than ${len.min - 1} and less than ${len.max + 1}`,
            args: [len.min, len.max],
        };
    }
    if (!nullable) {
        validator.notNull = {
            msg: `${fieldName} cannot be null`,
        };
    }
    return validator;
};

const dateValidateObject = (fieldName: string, nullable: boolean, before?: Date, after?: Date): ModelValidateOptions => {
    const validator: ModelValidateOptions = {
        isDate: {
            msg: `${fieldName} must be a valid date value`,
            args: true,
        },
    };
    if (before) {
        validator.isBefore = {
            msg: `date must be before: ${before}`,
            args: before.toString(),
        };
    }
    if (after) {
        validator.isAfter = {
            msg: `date must be before: ${after}`,
            args: after.toString(),
        };
    }
    if (!nullable) {
        validator.notNull = {
            msg: `${fieldName} cannot be null`,
        }
    }
    return validator;
}

const enumValidateObject = (fieldName: string, values: string[], nullable: boolean): ModelValidateOptions => {
    const validator: ModelValidateOptions = {
        isIn: {
            msg: `${fieldName} should be one of: ${values.join(', ')}`,
            args: [values],
        },
    }
    if (!nullable) {
        validator.notNull = {
            msg: `${fieldName} cannot be null`,
        };
    }
    return validator;
}

export default {
    stringValidateObject,
    dateValidateObject,
    enumValidateObject,
};
