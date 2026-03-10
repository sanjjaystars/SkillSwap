import { motion } from 'framer-motion';
import { SKILLS } from '@/utils/constants';

export default function SkillBars() {
  return (
    <div className="grid gap-3 mt-2">
      {SKILLS.map((skill) => (
        <div key={skill.label}>
          <div className="flex justify-between text-xs mb-1">
            <span>{skill.label}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="h-2 bg-neonGreen/10 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-neonGreen shadow-neon"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
