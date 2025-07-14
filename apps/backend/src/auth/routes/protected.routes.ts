import express from "express";
import { authenticate, AuthenticatedRequest, requireRole } from "../../common/middleware/authMiddleware";


const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  requireRole("super_admin"),
  (req: AuthenticatedRequest, res) => {
    res.json({
      message: "✅ Welcome to the super admin dashboard 🎉",
      user: req.user,
    });
  }
);

export default router;
