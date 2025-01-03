const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true, minlength:6 },
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

