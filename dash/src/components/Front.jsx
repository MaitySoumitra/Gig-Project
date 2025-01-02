import React from "react";
import { useForm } from "react-hook-form";

const Front = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

    <input {...register("Title", { required: true })} placeholder='Title'/> <br /> 
    {errors.Title && <span>This field cannot be empty</span>}<br /> 

    <input {...register("Description", { required: true })} placeholder='Description'/><br />   
    {errors.Description && <span>This field cannot be empty</span>}<br /> 

    <input {...register("Pricing", { required: true })} placeholder='Pricing'/>  <br /> 
    {errors.Pricing && <span>This field cannot be empty</span>}<br /> 

    <input {...register("Category", { required: true })} placeholder='Category'/>  <br /> 
    {errors.Category && <span>This field cannot be empty</span>}<br /> 

<label htmlFor="Addon">Addon</label> <br />
    <input {...register("AddonTitle", { required: true })} placeholder='Addon-Title'/>  
    {errors.AddonTitle && <span>This field cannot be empty</span>}

    <input {...register("AddonPrice", { required: true })} placeholder='Addon-Price'/>  
    {errors.AddonPrice && <span>This field cannot be empty</span>} <br /> <br />

    <input type="submit" />
  </form>
  );
};

export default Front;
