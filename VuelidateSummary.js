const VuelidateSummary = {

  install(Vue, options, validationMessages) {
    // defaults

    const defaultOptions = {
      validators: {
        includeInvalidOnly: true,
      },
    };

    // default messages for builtin validators
    const defaultValidationMessages = {
      required: 'This field is required',
      numeric: 'Must be a number',
      minLength: validator => `The minimum length is ${validator.min}`,
      minValue: validator => `The minimum value is ${validator.min}`,

      // TODO: add default messages builtin validators
      
    };

    // merge options and validation messages

    options = Object.assign(defaultOptions, options);
    validationMessages = Object.assign(defaultValidationMessages, validationMessages);

    // helper methods

    const isObj = x => typeof x === 'object';
    const isFn = x => typeof x === 'function';

    const getValidationMessage = (messages, validatorKey, validatorParams, value) => {
      const validationMessage = isFn(messages[validatorKey])
        ? messages[validatorKey](validatorParams, value)
        : messages[validatorKey];
      return validationMessage;
    };

    // main logic

    const extractInvalidFields = (validations, result = []) => {
      const keys = Object.keys(validations.$params);

      keys
        .filter(key => validations[key].$invalid)
        .forEach((key) => {
          const children = Object.keys(validations[key].$params);

          if (!isObj(validations[key].$model)) {
            result.push({
              key,
              value: validations[key].$model,
              validators: [],
            });

            children.forEach((validatorKey) => {
              const validator = validations[key][validatorKey];

              const valid = isObj(validator)
                ? !validator.$invalid
                : validator !== false;

              const validationMessage = getValidationMessage(
                validationMessages,
                validatorKey,
                validations[key].$params[validatorKey],
                validations[key].$model,
              );

              if (!valid || !options.validators.includeInvalidOnly) {
                result[result.length - 1].validators.push({
                  validatorKey,
                  valid,
                  message: validationMessage,
                  $params: validations[key].$params[validatorKey],
                });
              }
            });

            return result;
          }

          return extractInvalidFields(validations[key], result);
        });
      return result;
    };

    // methods

    const errorFields = validations => extractInvalidFields(validations);

    const translatedErrors = validations => (customValidationMessages) => {
      const fields = errorFields(validations);

      fields
        .filter(field => field.key in customValidationMessages)
        .forEach((field) => {
          const fieldIndex = fields.findIndex(m => m.key === field.key);

          field.validators
            .forEach((validator) => {
              const { validatorKey, $params } = validator;

              const validatorIndex = fields[fieldIndex].validators.findIndex(m => m.validatorKey === validatorKey);

              const validationMessage = getValidationMessage(
                customValidationMessages[field.key],
                validatorKey,
                $params,
                field.value,
              );

              // overwrite message with custom error
              fields[fieldIndex].validators[validatorIndex].message = validationMessage;
            });
        });


      return fields;
    };

    // vue instance

    Vue.prototype.$vuelidateSummary = validations => (customValidationMessages = {}) => translatedErrors(validations)(customValidationMessages);
  },
};

export default VuelidateSummary;
