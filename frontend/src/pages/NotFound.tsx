import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-glow mb-8"
        >
          <Play className="w-12 h-12 text-primary-foreground fill-current ml-1" />
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Oops! The video you're looking for seems to have gone viral somewhere else.
        </p>

        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
