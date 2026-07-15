import {
  arrayField,
  booleanField,
  enumField,
  nullable,
  numberField,
  objectField,
  optional,
  stringField,
} from './schema';

const MECHANIC_TYPES = [
  'Individual Mechanic',
  'Workshop / Garage',
  'Authorized Service Center',
  'Mobile Mechanic',
  'Towing Company',
  'Fuel Delivery Partner'
] as const;

const MECHANIC_STATUSES = ['Pending', 'Approved', 'Rejected', 'Inactive'] as const;

const phoneSchema = objectField({
  number: stringField({ minLength: 5 }),
  isWhatsapp: optional(booleanField()),
  isTelephone: optional(booleanField())
});

const mechanicPayloadShape = {
  mechanicType: enumField(MECHANIC_TYPES),
  name: optional(stringField({ minLength: 1 })),
  businessName: stringField({ minLength: 1 }),
  mechanicName: optional(stringField({ minLength: 1 })),
  description: optional(stringField()),
  image: optional(stringField()),
  websiteUrl: optional(stringField()),
  phone: arrayField(phoneSchema, { minLength: 1 }),
  emails: optional(arrayField(stringField({ minLength: 3 }))),
  address: stringField({ minLength: 1 }),
  landmark: optional(stringField({ minLength: 1 })),
  pincode: optional(stringField()),
  city: stringField({ minLength: 1 }),
  state: stringField({ minLength: 1 }),
  country: optional(stringField({ minLength: 1 })),
  latitude: numberField({ coerce: true }),
  longitude: numberField({ coerce: true }),
  serviceRadius: optional(nullable(numberField({ integer: true, min: 0, coerce: true }))),
  vehicleTypes: arrayField(stringField({ minLength: 1 }), { minLength: 1 }),
  serviceTypes: arrayField(stringField({ minLength: 1 }), { minLength: 1 }),
  evSupport: optional(booleanField()),
  homeService: optional(booleanField()),
  roadsideAssistance: optional(booleanField()),
  is24Hours: optional(booleanField()),
  holidayWorking: optional(booleanField()),
  operatingDays: arrayField(stringField({ minLength: 1 }), { minLength: 1 }),
  operatingHours: stringField({ minLength: 1 }),
  availability: optional(booleanField())
};

export const loginSchema = objectField({
  email: stringField({ minLength: 1 }),
  password: stringField({ minLength: 1 })
});

export const feedbackSubmissionSchema = objectField({
  type: stringField({ minLength: 1 }),
  description: stringField({ minLength: 1 })
});

export const donationSubmissionSchema = objectField({
  amount: numberField({ coerce: true, min: 1 }),
  paymentReference: optional(stringField({ minLength: 1 })),
  name: optional(stringField({ minLength: 1 })),
  email: optional(stringField({ minLength: 1 })),
  consentGiven: optional(booleanField())
});

export const routeRequestSchema = objectField({
  startLat: numberField({ coerce: true }),
  startLng: numberField({ coerce: true }),
  endLat: numberField({ coerce: true }),
  endLng: numberField({ coerce: true }),
  routeOption: optional(enumField(['Fastest', 'Shortest', 'Avoid Toll'] as const))
});

export const profileUpdateSchema = objectField({
  name: optional(stringField({ minLength: 1 })),
  email: optional(stringField({ minLength: 3 })),
  password: optional(stringField({ minLength: 6 }))
}, { requireAtLeastOne: true });

export const createUserSchema = objectField({
  email: stringField({ minLength: 1 }),
  name: optional(stringField({ minLength: 1 })),
  password: stringField({ minLength: 6 }),
  allowedScreens: optional(arrayField(stringField({ minLength: 1 })))
});

export const updateUserSchema = objectField({
  email: optional(stringField({ minLength: 1 })),
  name: optional(stringField({ minLength: 1 })),
  password: optional(stringField({ minLength: 6 })),
  allowedScreens: optional(arrayField(stringField({ minLength: 1 })))
}, { requireAtLeastOne: true });

export const feedbackStatusUpdateSchema = objectField({
  status: stringField({ minLength: 1 })
});

export const namedEntitySchema = objectField({
  name: stringField({ minLength: 1 })
});

export const featuredIdsSchema = objectField({
  ids: arrayField(numberField({ integer: true, min: 1, coerce: true }))
});

export const mechanicSchema = objectField(mechanicPayloadShape);

export const publicMechanicSubmissionSchema = objectField({
  existingMechanicId: optional(numberField({ integer: true, min: 1, coerce: true })),
  ...mechanicPayloadShape
});

export const mechanicBulkCreateSchema = objectField({
  mechanics: arrayField(objectField(mechanicPayloadShape), { minLength: 1 })
});

export const mechanicBulkStatusSchema = objectField({
  ids: arrayField(numberField({ integer: true, min: 1, coerce: true }), { minLength: 1 }),
  status: enumField(MECHANIC_STATUSES),
  remarks: optional(stringField())
});
