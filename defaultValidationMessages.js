export default {
  required: 'Required field',
  numeric: 'Not a number',
  custom: (validator, value) => `You provided '${value}' which is invalid`

  // Your own default validation messages
  
}