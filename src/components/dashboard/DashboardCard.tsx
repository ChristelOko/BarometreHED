import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const DashboardCard = ({ title, children, icon, fullWidth }: DashboardCardProps) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm p-6 ${fullWidth ? 'col-span-full' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};

export default DashboardCard;