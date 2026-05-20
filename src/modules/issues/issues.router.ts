import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createIssue } from "./issues.controller.js";

const router = Router();

router.post('/', authenticate as any, createIssue as any);
router.get('/');
router.get('/:id');
router.patch('/:id');
router.delete('/:id');

export default router;