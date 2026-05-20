import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createIssue, getAllIssues } from "./issues.controller.js";

const router = Router();

router.post('/', authenticate as any, createIssue as any);
router.get('/', authenticate as any, getAllIssues as any);
// router.get('/:id');
// router.patch('/:id');
// router.delete('/:id');

export default router;