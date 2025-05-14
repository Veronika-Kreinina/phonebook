import { model, Schema } from 'mongoose';
import { typeList } from '../../constants/contacts.js';

const contactsShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: typeList[0],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,

      required: true,
    },
    photo: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
export const ContactsCollection = model('contacts', contactsShema);

export const sortByKeys = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];
