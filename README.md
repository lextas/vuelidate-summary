# vuelidate-summary
Extract validation summary from [vuelidate](https://github.com/vuelidate/vuelidate)

### Disclaimer

This plugin is far from perfect but it could be adjusted to your own needs.

### Summary
This plugin loops through the validation object of [vuelidate](https://github.com/vuelidate/vuelidate) and creates a new array of invalid fields. The result has the following format:

```
[
  {
    "key": "someKey",
    "validators": [
      {
        "validatorKey": "required",
        "valid": false,
        "message": "This field is required",
        "$params": {
          "type": "required"
        }
      },
      {
        "validatorKey": "minValue",
        "valid": false,
        "message": "The minimum value is 1",
        "$params": {
          "type": "minValue",
          "min": 1
        }
      }
    ]
  }
]
```

Each object in the array contains the validator key and an array of (invalid) validators. Via the options it's possible to always list all validators for (invalid) fields.

See `VuelidateSummaryExample.vue` for a basic example.

### Basic Usage

- Register the plugin to your vue instance
```
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VuelidateSummary from './vuelidateSummary';

import App from './App';

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VuelidateSummary);

new Vue({
  render: h => h(App),
}).$mount('#app');

```
> optionally you can pass in your default validation messages
```
const defaultValidationMessages = require('./defaultValidationMessages');

Vue.use(
  VuelidateSummary,
  {}, // options
  defaultValidationMessage  
);
```

- Create a `computed property` that calls the vuelidate summary
```
export default {
  computed: {
    vuelidateSummary() {
      return this.$vuelidateSummary(this.$v)();
    },
  },
}
```
> optionally you can pass in custom validation messages for the specific validators as a second parameter. 

e.g:
```
const validationMessages = {
  donation: {
    minValue: (validator, value) => `The minimum donation amount is € ${validator.min}`,
  },
};

export default {
  computed: {
    vuelidateSummary() {
      return this.$vuelidateSummary(this.$v)(validationMessages);
    },
  },
}
```

> note: you can also call $vuelidateSummary on a nested validation object. e.g. `this.$v.someNestedValidationScheme`

### Options


| Option        | Default       | Description  |
| ------------- |:-------------:|:-------------:|
|  `validators.includeInvalidOnly` | true | if a field is invalid this option decides wheter to return all the validators for the field or only the invalid ones |

### i18n

While I haven't found time to actually test it, it should be fairly easy to translate the validation messages with plugins like [vuex-i18n](https://github.com/dkfbasel/vuex-i18n). Since i'm calling the validation message function with the validator parameters and the value it should be easy to do something like this:

```
const validationMessages = {
  messages: {
    maxValue: (validator, value) => $t('max_number_of_messages_reached, { max: validator.max, current: value }),
  },
};
```


### Known issues
- For know it only has a couple of default error messages but the `builtin validators` of vuelidate should be fairly easy to implement (just add them to the list).
- The validation is not reactive on the `$touch` action. Somehow the computed property does not detect the `$dirty` changes on submit.
