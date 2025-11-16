
import express from 'express';
import { getOrgs } from '../controllers/orgs.contoller.js';
import { getAllOrgs } from '../controllers/allOrgs.controller.js';

const router = express.Router();

router.get('/getOrgs', getOrgs)
router.get('/getAllOrgs', getAllOrgs); 

export default router; 