const express = require("express");
const router = express.Router();
const Member = require("../models/Member"); 

router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newMember = new Member({ name, email, role });
    await newMember.save();

    res.status(201).json({ message: "Member added successfully", member: newMember });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
});
router.get("/", async (req, res) => {
    try {
      const { search } = req.query; 
  
      let filter = {};
      if (search) {
        const regex = new RegExp(search, "i"); 
        filter = {
          $or: [
            { name: { $regex: regex } }, 
            { email: { $regex: regex } } 
          ]
        };
      }
      const members = await Member.find(filter);
      res.status(200).json(members); 
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Error fetching members", error: error.message });
    }
  });

router.post('/login', async(req, res)=>{
  const { email, password }=req.body;
  try{
    const member= await Member.findOne({email});
    if(!member){
      return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch=await member.matchPassword(password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid email or password"})
    }
    res.status(200).json({ message: "Login successful", member });
  }
  catch(err){
    res.status(500).json({message:"server error", err})
  }
})
  
module.exports = router;
