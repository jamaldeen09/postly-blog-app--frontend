import { Card, CardContent } from "@/components/ui/card"
import { motion, Variants } from "framer-motion"

const PostCardSkeleton = () => {
  // Animation variants
  const pulseVariants: Variants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const shimmerVariants: Variants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <Card className="p-0 h-fit shadow-none border border-gray-200 rounded-xl cursor-wait mb-6">
      <CardContent className="py-4 px-6 space-y-4">
        {/* Category & Author Skeleton */}
        <div className="flex items-center justify-between">
          {/* Category skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-6 w-20 rounded-full bg-gray-200"
          />

          {/* Author skeleton */}
          <div className="flex items-center gap-3">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="h-4 w-16 bg-gray-200 rounded"
            />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-6 bg-gray-200 rounded w-3/4"
          />
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-6 bg-gray-200 rounded w-1/2"
          />
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-4 bg-gray-200 rounded w-full"
          />
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-4 bg-gray-200 rounded w-5/6"
          />
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-4 bg-gray-200 rounded w-4/6"
          />
        </div>

        {/* Footer Skeleton */}
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
          {/* Stats Row Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like button skeleton */}
              <div className="flex items-center gap-1">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="h-8 w-16 rounded bg-gray-200"
                />
              </div>

              {/* Comment button skeleton */}
              <div className="flex items-center gap-1">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="h-8 w-16 rounded bg-gray-200"
                />
              </div>
            </div>

            {/* View Post button skeleton */}
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="h-8 w-20 rounded bg-gray-200"
            />
          </div>

          {/* Date skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="h-3 w-32 bg-gray-200 rounded"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export {
  PostCardSkeleton,
}