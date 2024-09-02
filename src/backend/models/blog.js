import { Schema, model } from 'mongoose'

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
    return ret
  },
})

export default model('Blog', blogSchema)
