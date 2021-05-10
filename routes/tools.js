const express = require('express');
const router = express.Router()
const Tool = require('../models/tools.js')

//GET All Tools
router.get('/', async (req, res) => {
    try {
        const tools = await Tool.find();
        res.json(tools);
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//GET One Tool
router.get('/:id', getTool, (req, res) => {
    res.json(res.tool);
})

//POST One Tool
router.post('/', async (req, res) => {
    const tool = new Tool({
        name: req.body.name,
        link: req.body.link,
        description: req.body.description,
        courses: req.body.courses,
        tags: req.body.tags,
    })

    try {
        const newTool = await tool.save()
        res.status(201).json(newTool);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//PUT One
router.put('/:id', getTool, async (req, res) => {
    if (req.body.name != null) {
        res.tool.name = req.body.name
    }
    if (req.body.link != null) {
        req.body.link = req.body.link
    }
    if (req.body.description != null){
        req.body.description = req.body.description
    }
    if (req.body.courses != null) {
        req.body.courses = req.body.courses
    }
    if (req.body.tags != null) {
        req.body.tags = req.body.tags
    }
    try {
        const updatedTool = await res.tool.save();
        res.json({updatedTool})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//DELETE One
router.delete('/:id', getTool, async (req, res) => {
    try {
        await res.tool.remove()
        res.json({message: 'Deleted Tool'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getTool (req, res, next) {
    let tool;
    try {
        tool = await Tool.findById(req.params.id)
        if (tool == null){
            return res.status(404).json({message: 'Cannot find tool'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.tool = tool;
    next();
}

module.exports = router;