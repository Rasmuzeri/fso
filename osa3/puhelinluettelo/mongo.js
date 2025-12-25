const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name required']
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'Number required'],
    validate: {
      // ^      : start of string
      // \d{2,3}: 2 or 3 digits
      // -      : a literal hyphen
      // \d+    : one or more digits
      // $      : end of string
      validator: (v) => /^\d{2,3}-\d+$/.test(v),
      message: props => `${props.value} is not a valid phone number! Format must be 09-12345 or 040-123456`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
