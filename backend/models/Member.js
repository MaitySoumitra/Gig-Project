const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true },
  password: { 
    type: String, 
    required: true, 
    minlength:6 
  },
  photo: {
    type: String,  
    required: false, 
},
   status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
      }, 
      lastLogin: {
          type: Date,
          required: false, 
      },
      createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',  
          required: false, 
      },
      updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', 
          required: false, 
      },
      resetToken: {  
          type: String,
      },
      resetTokenExpiration: {  
          type: Date,
      },
},
{
  timestamps: true,
});
memberSchema.pre('save', async function(next){
  if(!this.isModified('password')|| this.password.startsWith('$2a$')){
    return next();
  }
  try{
    const salt =await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt)
    next();
  }
  catch(err){
    next(err);
  }
})

memberSchema.methods.matchPassword=async function(password){
  return await bcrypt.compare(password,this.password);
}

module.exports= mongoose.model("Member", memberSchema);

