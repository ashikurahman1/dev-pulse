import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { createIssue, deleteIssue, getAllIssues, getSingleIssue, updateIssue } from "./issues.controller.js";

const router = Router();

router.post('/', authenticate as any, createIssue as any);
router.get('/', getAllIssues as any);
router.get('/:id', getSingleIssue as any);
router.patch('/:id', authenticate as any, updateIssue as any);
router.delete('/:id', authenticate as any, authorize(['maintainer']) as any, deleteIssue as any);

export default router;