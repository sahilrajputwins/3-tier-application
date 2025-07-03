'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import {Home} from 'lucide-react';

const AboutPage = () => {
  const containerVariants = {
    hidden: {opacity: 0},
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
        About SchoolVerse
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground mb-8 text-center"
        variants={itemVariants}
      >
        SchoolVerse is an innovative platform designed to streamline the management of students and teachers,
        making educational administration more efficient and user-friendly. Our mission is to provide
        educators and administrators with the tools they need to focus on what truly matters: fostering a
        positive and productive learning environment.
      </motion.p>

      <motion.div
        className="p-6 rounded-lg shadow-md bg-secondary text-secondary-foreground"
        variants={itemVariants}
        whileHover="hover"
      >
        <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
        <p>
          To empower schools with a comprehensive management solution that enhances communication,
          simplifies administrative tasks, and promotes a collaborative educational community.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} whileHover="hover">
        <Link
          href="/"
          className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors duration-300 block text-center"
        >
          <Home className="mr-2 h-4 w-4"/>
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
