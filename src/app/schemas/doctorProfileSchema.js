// Yup Validation Schema
import * as yup from 'yup';

export const doctorProfileSchema = yup
  .object({
    specialization: yup.string().required('Specialization is required'),
    experience: yup
      .number()
      .typeError('Must be a number')
      .positive()
      .integer()
      .required('Experience is required'),
    consultationFee: yup
      .number()
      .typeError('Must be a number')
      .positive()
      .required('Fee is required'),
    bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
  })
  .required();
