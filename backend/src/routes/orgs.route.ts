
import express from 'express';
import { getOrgs } from '../controllers/orgs.contoller.js';

const router = express.Router();

router.get('/getOrgs', getOrgs)

export default router; 