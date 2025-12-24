// pages/api/auth/me.ts
// import { withIronSessionApiRoute } from "iron-session/next";
// import { sessionOptions } from "@/lib/session";

// export default withIronSessionApiRoute(async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ user: null });
//   }

//   res.json({ user: req.session.user });
// }, sessionOptions);
