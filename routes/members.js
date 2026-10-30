const express = require('express');
const Member = require('../models/Member');
const Plan = require('../models/Plan');
const router = express.Router();

const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

router.post('/', async (req,res) => {
    try{
        const {name, plan } = req.body;
        const planDoc = await Plan.findbyId(plan);
        if (!planDoc) return res.status(400).json({error: 'Plan not found'});

        const startDate = new Date();
        const member = await Member.create({
            name,
            plan: planDoc._id,
            startDate,
            endDate: addMonths(startDate, planDoc.duration),
        });
        res.status(201).json(await member.populate('plan'));
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/', async (req,res) => {
    try{
        const filter = {};
        const now = new Date();
        if (req.query.status === 'expired') filter.endDate = {$lt: now};
        if (req.query.status === 'active') filter.endDate = {$gte: now};

        res.json(await Member.find(filter).populate('plan').sort({createdAt: -1}));
    } catch (err) {
        res.status(500).json ({error: err.message});
    }
});

