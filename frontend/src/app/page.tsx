"use client";

import Link from "next/link";
import {motion} from 'framer-motion';
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: {opacity: 0,},
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1.5,
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {x: -50, opacity: 0},
    visible: {
      x: 0,
      opacity: 1,
      transition: {duration: 0.8, type: 'spring', stiffness: 100},
    },
    hover: {
      scale: 1.1,
      transition: {duration: 0.3},
    },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold mb-4 text-primary"
        variants={itemVariants}
      >
        Welcome to SchoolVerse
      </motion.h1>
      <motion.p
        className="text-lg text-white mb-8 text-center"
        variants={itemVariants}
      >
        SchoolVerse is your all-in-one platform to manage students and teachers efficiently.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <motion.div
          className="p-6 rounded-lg shadow-md bg-secondary text-secondary-foreground"
          variants={itemVariants}
          whileHover="hover"
        >
          <h2 className="text-xl font-semibold mb-2">About Students</h2>
          <p>
            Manage student information, including names, roll numbers, and classes. Add,
            delete, and update student records easily.
          </p>
        </motion.div>

        <motion.div
          className="p-6 rounded-lg shadow-md bg-secondary text-secondary-foreground"
          variants={itemVariants}
          whileHover="hover"
        >
          <h2 className="text-xl font-semibold mb-2">About Teachers</h2>
          <p>
            Manage teacher information, including names, subjects, and classes. Add,
            delete, and update teacher records efficiently.
          </p>
        </motion.div>
      </div>

      <div className="flex space-x-4 mt-8">
        <motion.div variants={itemVariants} whileHover="hover">
          <Link
            href="/student"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors duration-300 block text-center"
          >
            Manage Students
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} whileHover="hover">
          <Link
            href="/teacher"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors duration-300 block text-center"
          >
            Manage Teachers
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;
