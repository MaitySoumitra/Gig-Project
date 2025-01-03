import React from 'react'
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    toast.success('Form submitted successfully!');
    console.log(data);
    reset(); // Reset form after submission
  };

  return (
    <Box
    sx={{
      maxWidth: 600,
      margin: 'auto',
      padding: 7,
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: '#fff',
    }}
  >
    <h2 style={{ textAlign: 'center' }}>Product Form</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        variant="outlined"
        {...register('title', { required: 'Title is required' })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        {...register('description', { required: 'Description is required' })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      {/* Pricing */}
      <TextField
        fullWidth
        label="Pricing"
        margin="normal"
        variant="outlined"
        type="number"
        {...register('pricing', {
          required: 'Pricing is required',
          min: { value: 1, message: 'Pricing must be at least 1' },
        })}
        error={!!errors.pricing}
        helperText={errors.pricing?.message}
      />

      {/* Addon Title */}
      <TextField
        fullWidth
        label="Addon Title"
        margin="normal"
        variant="outlined"
        {...register('addonTitle', { required: 'Addon title is required' })}
        error={!!errors.addonTitle}
        helperText={errors.addonTitle?.message}
      />

      {/* Addon Pricing */}
      <TextField
        fullWidth
        label="Addon Pricing"
        margin="normal"
        variant="outlined"
        type="number"
        {...register('addonPricing', {
          required: 'Addon pricing is required',
          min: { value: 0, message: 'Addon pricing must be non-negative' },
        })}
        error={!!errors.addonPricing}
        helperText={errors.addonPricing?.message}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>
    </form>

    {/* Toast Notification */}
    <ToastContainer position="top-center" autoClose={3000} />
  </Box>
  )
}

export default Form