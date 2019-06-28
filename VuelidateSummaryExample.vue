<template>
  <div>
    Basic example of VuelidateSummary
    <div
      v-if="vuelidateSummary.length"
      class="vuelidate-summary">
      <h1>Summary</h1>
      <p>
        Some fields are invalid
      </p>
      <ul>
        <li
          v-for="validation in vuelidateSummary"
          :key="validation.key">
          <span>{{ validation.key }}</span>
          <ul>
            <li
              v-for="validator in validation.validators"
              :key="validator.validatorKey">
              [{{ validator.validatorKey }}] {{ validator.message }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div>
      <div class="input-group">
        <label for="firstname">Firstname</label>
        <input
          v-model="firstname"
          type="text">
      </div>

      <div class="input-group">
        <label for="lastname">Lastname</label>
        <input
          v-model="lastname"
          type="text">
      </div>

      <label class="input-group">
        <label for="age">Age</label>
        <input
          v-model="age"
          type="text">
      </label>

      <label class="input-group">
        <label for="donation">Donation</label>
        <input
          v-model="donation"
          type="text">
      </label>
      <button @click="submit">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import {
  required, numeric, minValue, minLength,
} from 'vuelidate/lib/validators';

const validationMessages = {
  donation: {
    minValue: validator => `The minimum donation amount is € ${validator.min}`,
  },
};

const validations = {
  firstname: {
    required,
    minLength: minLength(3),
  },
  lastname: {
    required,
  },
  age: {
    numeric,
    minValue: minValue(10),
  },
  donation: {
    numeric,
    minValue: minValue(10),
  },
};

export default {
  data() {
    return {
      firstname: null,
      lastname: null,
      age: null,
      donation: 10,
    };
  },
  validations,
  computed: {
    vuelidateSummary() {
      return this.$vuelidateSummary(this.$v)(validationMessages);
    },
  },
  methods: {
    submit() {
      console.log('submit');
      this.$v.$touch();
    },
  },
};
</script>

<style lang="scss">
.input-group{
  display: block;
  margin-bottom: 10px;

  label{
    display: inline-block;
    min-width: 175px;
  }
}

.vuelidate-summary{
  padding: 15px;
  border: 1px solid lightcoral;
  background-color: lighten(lightcoral, 10%);
  margin-bottom: 10px;

  h1,
  ul{
    margin: 0;
    padding: 0;
  }

  h1{
    font-size: 1.5rem;
  }

  ul{
    li{

      list-style-type: none;

      span{
        font-weight: bold;
      }
    }
  }


}
</style>
