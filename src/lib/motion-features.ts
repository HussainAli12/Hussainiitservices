// Loaded on demand by <MotionProvider> so Framer Motion's animation engine stays off the
// critical path. domMax (not domAnimation) because the testimonials and gallery use drag.
import { domMax } from "framer-motion";

export default domMax;
