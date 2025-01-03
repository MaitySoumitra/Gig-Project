const express=require('express')
const router=express.Router()
const Gig=require('../models/Gig')

router.get('/', async(req, res)=>{
    try{
        const gigs=await Gig.find()
        res.json(gigs)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
router.get('/:id', async(req,res)=>{
    
    try{
        const gigs= await Gig.findById()
        if(!gigs) return res.status(404).json({message:"Gig Not found"})
        res.json(gigs)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
router.post('/', async(req,res)=>{
    const {title, description, price, addons}=req.body;
    const newGig=new Gig({title, description, price, addons})
    try{
        const savedGig=await newGig.save()
        res.status(200).json(savedGig)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})
router.put('/:id',async(req,res)=>{
    try{
        const updatedGig=await Gig.findByIdAndUpdate(
            req.params.id, req.body,{new:true})
        if(!updatedGig) return res.status(404).json({message:"gig not found"})
        res.json(updatedGig)
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})
router.delete('/:id', async (req, res) => {
    try {
      const gig = await Gig.findByIdAndDelete(req.params.id);
      if (!gig) return res.status(404).json({ message: 'Gig not found' });
      res.json({ message: 'Gig deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;