import React from 'react'
import { useForm } from 'react-hook-form'

export type ReviewInputs = {
  email?: string
  rating?: number
  review?: string
  location?: string
  date?: Date
}

export function BasicReviewForm({
  email = 'default value',
  rating = 1,
  review = 'default value',
  location = 'default value',
  date = new Date(),
}: React.PropsWithChildren<ReviewInputs>) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ReviewInputs>({ mode: 'all' })


  const onSubmit = () => {
    console.log('submit')
  }

  return (
    <div className={'hello'}>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          {...register('rating', {
            required: { value: true, message: 'This field is required' },
            maxLength: { value: 10, message: 'Too few characters' },
            minLength: { value: 5, message: 'Too many characters' },
          })}
          placeholder="Rating"
          type="radio"
        />
        <p>
          {errors.rating?.message}
        </p>

        <input
          {...register('review', {
            required: { value: true, message: 'This field is required' },
            maxLength: { value: 10000, message: 'Too few characters' },
            minLength: { value: 10, message: 'Too many characters' },
          })}
          placeholder="write a review"
          type="text"
        />
        <p>
          {errors.review?.message}
        </p>

        <input
          {...register('email', {
            required: { value: true, message: 'This field is required' },
            maxLength: { value: 10, message: 'Too few characters' },
            minLength: { value: 5, message: 'Too many characters' },
          })}
          placeholder="Email"
          type="text"
        />
        <p>
          {errors.email?.message}
        </p>

        <input
          {...register('location', {
            required: { value: false, message: 'This field is not required' },
          })}
          placeholder="Location"
          type="search"
        />
        <p>
          {errors.location?.message}
        </p>

        <input
          {...register('date', {
            required: { value: false, message: 'This field is not required' },
          })}
          placeholder="Date of experience"
          type="date"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default BasicReviewForm
